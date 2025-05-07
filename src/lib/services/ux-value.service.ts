import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UxValueService {
	constructor() {}

	public buildDistributionArgs(
		dist: {
			initialDistribution: [number, number][];
			initialValue: number;
			scale?: number;
		},
		resampleToSize: number = 128,
	): string {
		let distributionArgs = '';

		// Convert distribution to dirac deltas
		const diracDeltas: [number, number][] = [];
		for (let index = 0; index < dist.initialDistribution.length; index++) {
			const [position, weight] = dist.initialDistribution[index];
			if (weight > 0) {
				const scaledPosition = dist.scale ? dist.scale * position : position;
				diracDeltas.push([scaledPosition, weight]);
			}
		}

		// Calculate the scaled (or unscaled) initial value
		const value = dist.scale ? dist.initialValue * dist.scale : dist.initialValue;

		// Create UX string for original distribution
		const originalUXString = toUxString({
			particleValue: value,
			sampleCount: BigInt(diracDeltas.length),
			diracDeltas,
		});

		// If there's only one Dirac delta or none, skip interpolation
		if (diracDeltas.length <= 1) {
			distributionArgs += `${originalUXString} `;
			return distributionArgs;
		}

		// Interpolate to a fixed size if more than one delta
		const interpolatedSize = resampleToSize ?? 16;
		const interpolatedDD = interpolateDeltas(diracDeltas, interpolatedSize);

		// Create UX string for interpolated distribution
		const interpolatedUXString = toUxString({
			particleValue: value,
			sampleCount: BigInt(interpolatedDD.length),
			diracDeltas: interpolatedDD,
		});
		// Append final string
		distributionArgs += `${interpolatedUXString} `;

		return distributionArgs;
	}
}

type ObjectValues<T> = T[keyof T];

const UxRepresentationTypeE = {
	Zurich: '00',
	Athens: '04',
} as const;
type UxRepresentationType = ObjectValues<typeof UxRepresentationTypeE>;

export type UxStringObject = {
	particleValue: number;
	representationType: UxRepresentationType;
	sampleCount: bigint;
	distributionMean: number;
	nonZeroDiracDeltaCount: number;
	diracDeltas: [number, number][];
};

export function toUxString({
	particleValue,
	representationType = UxRepresentationTypeE.Zurich,
	sampleCount,
	distributionMean = particleValue,
	diracDeltas,
}: Partial<UxStringObject>) {
	let uxString = '';

	uxString += particleValue;
	uxString += 'Ux';
	uxString += representationType;

	if (diracDeltas === undefined) {
		throw new Error('Invalid dirac delta list.');
	}

	// validate sample count
	if (sampleCount === undefined || sampleCount <= 0n) {
		throw new Error('Invalid sample count. Sample count must be a positive integer.');
	}

	if (sampleCount !== BigInt(diracDeltas?.length)) {
		throw new Error('Invalid sample count. Sample count must match the number of dirac deltas.');
	}

	uxString += uint64ToPaddedHexString(sampleCount);

	// validate distribution mean
	if (distributionMean === undefined) {
		throw new Error('Invalid distribution mean.');
	}

	uxString += float64ToPaddedHexString(distributionMean);

	uxString += uint32ToPaddedHexString(diracDeltas.length);

	// normalise diracDeltas
	const sumOfWeights = diracDeltas.reduce((sum, diracDelta) => {
		return [0, sum[1] + diracDelta[1]];
	})[1];

	const scaledDiracDeltas = diracDeltas.map((diracDeltas) => {
		return [diracDeltas[0], scaleAndRound(diracDeltas[1], sumOfWeights)];
	});

	scaledDiracDeltas.map((diracDelta) => {
		uxString +=
			// @ts-ignore
			float64ToPaddedHexString(diracDelta[0]) +
			// @ts-ignore
			uint64ToPaddedHexString(diracDelta[1]);
	});

	return uxString;
}

function uint64ToPaddedHexString(value: bigint): string {
	// const valueInHex = (value >>> 0).toString(16)

	// @ts-ignore
	const valueInHex = toBinary(value, { type: 'BigUint64' });
	return padStringWithZeros(valueInHex);
}
function uint32ToPaddedHexString(value: number): string {
	const valueInHex = (value >>> 0).toString(16);
	return padStringWithZeros(valueInHex, 8);
}

function float64ToPaddedHexString(value: number): string {
	const valueInHex = toBinary(value);
	return padStringWithZeros(valueInHex);
}

function padStringWithZeros(value: string, fieldLength: number = 16): string {
	if (fieldLength < value.length) {
		return value;
	}

	return '0'.repeat(fieldLength - value.length) + value;
}

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
function toBinary(value: number, { type = 'Float64', littleEndian = false, separator = '', radix = 16 } = {}) {
	// @ts-ignore
	const bytesNeeded = globalThis[`${type}Array`].BYTES_PER_ELEMENT;
	const dv = new DataView(new ArrayBuffer(bytesNeeded));

	// @ts-ignore
	dv[`set${type}`](0, value, littleEndian);
	const bytes = Array.from({ length: bytesNeeded }, (_, i) =>
		dv
			.getUint8(i)
			.toString(radix)
			.toUpperCase()
			.padStart(8 / Math.log2(radix), '0'),
	);
	return bytes.join(separator);
}

export function interpolateDeltas(deltas: [number, number][], numPoints: number): [number, number][] {
	if (deltas.length <= 1) {
		throw new Error('Not enough dirac deltas to interpolate');
	}
	function linspace(start: number, end: number, n: number): number[] {
		const diff = end - start;
		const step = diff / (n - 1);
		return Array.from({ length: n }, (_, i) => start + i * step);
	}

	const newSpace = linspace(deltas[0][0], deltas[deltas.length - 1][0], numPoints);
	const newDeltas: [number, number][] = [];

	for (const newLocation of newSpace) {
		let lowerBoundIndex = 0;
		while (lowerBoundIndex < deltas.length - 1 && deltas[lowerBoundIndex][0] <= newLocation) {
			lowerBoundIndex++;
		}

		if (lowerBoundIndex >= deltas.length) {
			lowerBoundIndex = deltas.length - 1;
		}

		const lowerDelta = deltas[lowerBoundIndex - 1];
		const upperDelta = deltas[lowerBoundIndex];

		const range = upperDelta[0] - lowerDelta[0];
		const lowerDeltaContribution = range === 0 ? 0.5 : (upperDelta[0] - newLocation) / range;
		const upperDeltaContribution = range === 0 ? 0.5 : (newLocation - lowerDelta[0]) / range;

		const newDeltaWeight = (lowerDeltaContribution * lowerDelta[1] + upperDeltaContribution * upperDelta[1]) / 2;
		newDeltas.push([newLocation, newDeltaWeight]);
	}

	return newDeltas;
}

function scaleAndRound(weight: number, sumOfWeights: number): bigint {
	const MAX_VALUE: bigint = BigInt('9223372036854775808');
	const PRECISION: bigint = BigInt('1000000000000'); // 12 decimal places

	const bigWeight = BigInt(Math.round(weight * Number(PRECISION)));
	const bigSumOfWeights = BigInt(Math.round(sumOfWeights * Number(PRECISION)));

	const scalingFactor = MAX_VALUE / bigSumOfWeights;
	const scaledValue = bigWeight * scalingFactor;

	const remainder = (bigWeight * MAX_VALUE) % bigSumOfWeights;
	const halfSumOfWeights = bigSumOfWeights / BigInt(2);

	return remainder >= halfSumOfWeights ? scaledValue + BigInt(1) : scaledValue;
}
