function isInteger(value: number): boolean {
	return Math.round(value) === value;
}

class DiracDelta {
	position: number;
	mass: number;

	constructor(position: number, mass: number) {
		this.position = position;
		this.mass = mass;
	}
}

export class DistributionalValue {
	diracDeltas: DiracDelta[] = [];

	mean: null | number = null;
	initialized: boolean = false;
	sampleCount: null | number = null;
	representationType: null | number = null;
	diracDeltaCount: number = 0; // must be integer
	particleValue: null | number = null;

	// Special values
	nanMass: number = NaN;
	infMass: number = NaN;
	minusInfMass: number = NaN;
	hasSpecialValues: boolean = false;

	// metadata
	expression_name: null | string = null;
	expression_subprogram: null | string = null;
	labelPrefix: string = '';
	label: string = '';

	// properties
	private _hasNoZeroMass: boolean = false;
	private _isFinite: boolean = false;
	private _isSorted: boolean = false;
	private _isCured: boolean = false;
	private _sd: null | number = null;
	private _isFullValidTTR: null | boolean = null;

	constructor() {}
	public toString = (): string => {
		let strVal: string = `${this.representationType}-${this.diracDeltaCount}`;
		strVal += '\nPosition\t Mass';
		for (let i = 0; i < this.diracDeltas.length; i++) {
			strVal += `\n${this.diracDeltas[i].position}\t ${this.diracDeltas[i].mass}`;
		}
		return strVal;
	};

	public getMaxDiracDelta = (): DiracDelta => {
		const max = this.diracDeltas.reduce(function (prev, current) {
			return prev && prev.mass > current.mass ? prev : current;
		});
		return max;
	};

	public getMinDiracDelta = (): DiracDelta => {
		const min = this.diracDeltas.reduce(function (prev, current) {
			return prev && prev.mass < current.mass ? prev : current;
		});
		return min;
	};

	public getSD = (): number => {
		if (this._sd != null) {
			return this._sd;
		}

		if (this.hasSpecialValues) {
			this._sd = NaN;
			return this._sd;
		}

		var stdDev: number = 0.0;
		for (let i = 0; i < this.diracDeltaCount; i++) {
			stdDev += this.diracDeltas[i].mass * Math.pow(this.diracDeltas[i].position, 2);
		}
		this._sd = Math.sqrt(stdDev - Math.pow(this.mean, 2));
		return this._sd;
	};

	public getVariance = (): number => {
		return Math.pow(this.getSD(), 2);
	};

	private dropZeroMassPositions = () => {
		if (this.diracDeltas.length == 0 || this._hasNoZeroMass) {
			return;
		}

		/*
		 *	Filter based on a condition (mass !== 0)
		 */
		this.diracDeltas = this.diracDeltas.filter((diracDelta) => diracDelta.mass !== 0);
		this.diracDeltaCount = this.diracDeltas.length;
		this._hasNoZeroMass = true;
	};

	private sort = () => {
		if (this._isFinite && this._isSorted) {
			return;
		}

		let finiteSortedDiracDeltas: DiracDelta[] = this.diracDeltas;
		finiteSortedDiracDeltas = finiteSortedDiracDeltas.filter((dd) => isFinite(dd.position));
		finiteSortedDiracDeltas.sort((a, b) => a.position - b.position);

		this.diracDeltas = finiteSortedDiracDeltas;
		this.diracDeltaCount = this.diracDeltas.length;
		this._isFinite = true;
		this._isSorted = true;
	};

	private cure = () => {
		/**
		 *	Combine Dirac deltas with same positions.
		 */
		if (this._isCured) {
			return;
		}

		let curedFiniteSortedDiracDeltas: DiracDelta[] = [this.diracDeltas[0]];
		for (let i = 1; i < this.diracDeltas.length; i++) {
			let dd = this.diracDeltas[i];
			if (dd.position == curedFiniteSortedDiracDeltas[curedFiniteSortedDiracDeltas.length - 1].position) {
				curedFiniteSortedDiracDeltas[curedFiniteSortedDiracDeltas.length - 1].mass += dd.mass;
			} else {
				curedFiniteSortedDiracDeltas.push(dd);
			}
		}
		this.diracDeltas = curedFiniteSortedDiracDeltas;
		this.diracDeltaCount = this.diracDeltas.length;
		this._isCured = true;
	};

	private parseHexDouble(hexSubstring: string): number {
		const binaryData: Uint8Array = new Uint8Array(hexSubstring.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
		// Create a DataView to interpret the binary data
		const dataView = new DataView(binaryData.buffer);

		/*
		 *	Read the double-precision floating-point number in big-endian format.
		 *	The second parameter (false) indicates big-endian
		 */
		return dataView.getFloat64(0, false);
	}

	private parseHexMass(hexSubstring: string): number {
		const binaryData: Uint8Array = new Uint8Array(hexSubstring.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

		// Create a DataView to interpret the binary data
		const dataView = new DataView(binaryData.buffer);
		const divisor: bigint = BigInt(2) ** BigInt(63);

		/*
		 *	The probability mass is a fixed-point format with 0x8000000000000000 representing 1.0.
		 *	Divide by 0x8000000000000000 to get the float it represents.
		 */
		return Number(dataView.getBigUint64(0, false)) / Number(divisor);
	}

	private isPowerOfTwo(num: number): boolean {
		/**
		 *	A power of two has only one bit set in its binary representation.
		 *	So, we can use bitwise AND to check if num is a power of two.
		 */
		return num > 0 && (num & (num - 1)) === 0;
	}

	private findGreatestDivisorExponentOf2 = (number: number): number => {
		/**
		 *	Finds the greatest exponent n such that 2^n divides the number.
		 */
		return Math.floor(Math.log2(number & ~(number - 1)));
	};

	/**
	 * Ux hex string parser
	 * @param text
	 * @returns null
	 */
	public parseHex(text: string) {
		/**
		 *	Here is the specification of the format:
		 *		- "Ux"                                              ( 2 characters)
		 *		- Representation type (uint8_t)                     ( 2 characters)
		 *		- Number of samples (uint64_t)                      (16 characters)
		 *		- Mean value of distribution (double)               (16 characters)
		 *		- Number of non-zero mass Dirac deltas (uint32_t)   ( 8 characters)
		 *	Pairs of:
		 *		- Support position (double)                         (16 characters)
		 *		- Probability mass (uint64_t)                       (16 characters)
		 *
		 *	Source: https://github.com/signaloid/project-laplace-analysis-tools-issues/issues/35#issuecomment-1117121420
		 */

		/*
		 *	convert to lowercase
		 */
		text = text.toLowerCase();
		if (!text.includes('ux')) {
			throw new Error('parseHex: no valid Ux string was given.');
		}
		const splitString = text.split('ux', 2);
		const particleString: string = splitString[0];
		const uxString: string = 'ux' + splitString[1];

		/*
		 *	Parse particle value
		 */
		if (particleString.length > 0) {
			this.particleValue = parseFloat(particleString);
		}

		/**
		 *	Indices for uxString[] below are based on the specification in the
		 *	docstring above.
		 */

		/**
		 *	Parse metadata
		 */
		const representationType: number = parseInt(uxString.substring(2, 4), 16);
		const sampleCount: number = parseInt(uxString.substring(4, 20), 16);
		const meanValue: number = this.parseHexDouble(uxString.substring(20, 36));
		const diracDeltaCount: number = parseInt(uxString.substring(36, 44), 16);

		/**
		 *	Parse data
		 *	Offset value 44 is the index at which the actual data starts (44 == 2+2+16+16+8).
		 */
		let offset: number = 44;
		let supportPositionList: number[] = [];
		let probabilityMassList: number[] = [];

		for (let i = 0; i < diracDeltaCount; i++) {
			supportPositionList.push(this.parseHexDouble(uxString.substring(offset, offset + 16)));
			probabilityMassList.push(this.parseHexMass(uxString.substring(offset + 16, offset + 32)));
			/**
			 *	Set offset for next data pair.
			 */
			offset += 32;
		}

		this.mean = meanValue;
		this.sampleCount = sampleCount;
		this.representationType = representationType;
		this.diracDeltaCount = diracDeltaCount;
		this.initialized = true;

		let diracDeltas: DiracDelta[] = [];
		for (let i = 0; i < supportPositionList.length; i++) {
			if (Number.isNaN(supportPositionList[i])) {
				this.hasSpecialValues = true;
				this.nanMass = probabilityMassList[i];
			} else if (supportPositionList[i] == Infinity) {
				this.hasSpecialValues = true;
				this.infMass = probabilityMassList[i];
			} else if (supportPositionList[i] == -Infinity) {
				this.hasSpecialValues = true;
				this.minusInfMass = probabilityMassList[i];
			} else {
				diracDeltas.push(new DiracDelta(supportPositionList[i], probabilityMassList[i]));
			}
		}
		this.diracDeltas = diracDeltas;
		this.diracDeltaCount = this.diracDeltas.length;
	}

	/**
	 *	Computes the expected Dirac delta of an input bin PDF.
	 *
	 *	@param boundaryPositions: Positions of bin boundaries of the input bin PDF.
	 *	@param binWidths: Widths of the bins of the input bin PDF.
	 *	@param binHeights: Heights of the bins of the input bin PDF.
	 *	@returns expectedDiracDelta: DiracDelta
	 */
	private binPDFExpectedDiracDelta(
		boundaryPositions: number[],
		binWidths: number[],
		binHeights: number[],
	): DiracDelta {
		let momentSum: number = 0.0;
		let probabilitySum: number = 0.0;
		let probability: number;
		for (let i = 0; i < binWidths.length; i++) {
			probability = binWidths[i] * binHeights[i];
			probabilitySum += probability;
			momentSum += (probability * (boundaryPositions[i + 1] + boundaryPositions[i])) / 2;
		}

		return new DiracDelta(momentSum / probabilitySum, probabilitySum);
	}

	/**
	 *	Computes TTR for an input bin PDF.
	 *
	 *	@param boundaryPositions: Positions of bin boundaries of the input bin PDF.
	 *	@param binWidths: Widths of the bins of the input bin PDF.
	 *	@param binHeights: Heights of the bins of the input bin PDF.
	 *	@param order: TTR order.
	 *	@returns A 2^order length array of DiracDelta.
	 */
	private binPDF2TTR(
		boundaryPositions: number[],
		binWidths: number[],
		binHeights: number[],
		order: number,
	): DiracDelta[] {
		const expectedDiracDelta: DiracDelta = this.binPDFExpectedDiracDelta(boundaryPositions, binWidths, binHeights);
		let ttr: DiracDelta[] = [];

		if (order == 0) {
			ttr.push(expectedDiracDelta);
		} else {
			let lowBoundaryPositions: number[] = [];
			let highBoundaryPositions: number[] = [];
			let lowBinHeights: number[] = [];
			let lowBinWidths: number[] = [];
			let highBinWidths: number[] = [];
			let highBinHeights: number[] = [];
			for (let i = 0; i < boundaryPositions.length; i++) {
				const boundaryPosition = boundaryPositions[i];
				if (boundaryPosition == expectedDiracDelta.position) {
					lowBoundaryPositions = boundaryPositions.slice(0, i + 1);
					lowBinWidths = binWidths.slice(0, i);
					lowBinHeights = binHeights.slice(0, i);
					highBoundaryPositions = boundaryPositions.slice(i);
					highBinWidths = binWidths.slice(i);
					highBinHeights = binHeights.slice(i);
					break;
				} else if (boundaryPosition > expectedDiracDelta.position) {
					lowBoundaryPositions = [...boundaryPositions.slice(0, i), expectedDiracDelta.position];
					lowBinWidths = [
						...binWidths.slice(0, i - 1),
						expectedDiracDelta.position - boundaryPositions[i - 1],
					];
					lowBinHeights = binHeights.slice(0, i);

					highBoundaryPositions = [expectedDiracDelta.position, ...boundaryPositions.slice(i)];
					highBinWidths = [boundaryPositions[i] - expectedDiracDelta.position, ...binWidths.slice(i)];
					highBinHeights = binHeights.slice(i - 1);
					break;
				}
			}
			ttr = ttr.concat(this.binPDF2TTR(lowBoundaryPositions, lowBinWidths, lowBinHeights, order - 1));
			ttr = ttr.concat(this.binPDF2TTR(highBoundaryPositions, highBinWidths, highBinHeights, order - 1));
		}

		return ttr;
	}

	/**
	 *	Finds the boundary positions while checking whether the input Dirac deltas form a valid TTR.
	 *	Then, creates the unique binning such that the average of two bins surrounding a Dirac delta is the Dirac delta.
	 *	If the input Dirac deltas form a valid TTR, then the TTR of the binning should exactly coincide with the input.
	 *
	 *	@param finiteSortedDiracDeltas: Input dirac deltas
	 *	@param exponent: Size of TTR dirac deltas
	 */
	private createBinning = (
		finiteSortedDiracDeltas: DiracDelta[],
		exponent: number,
	): [number[], number[], number[]] => {
		const numberOfFiniteDiracDeltas: number = finiteSortedDiracDeltas.length;
		const numberOfBoundaries: number = 2 * numberOfFiniteDiracDeltas + 1;
		const boundaryPositions: number[] = Array(numberOfBoundaries).fill(NaN);
		const boundaryProbabilities: number[] = Array(numberOfBoundaries).fill(NaN);

		for (let i = 0; i < finiteSortedDiracDeltas.length; i++) {
			boundaryPositions[i * 2 + 1] = finiteSortedDiracDeltas[i].position;
			boundaryProbabilities[i * 2 + 1] = finiteSortedDiracDeltas[i].mass;
		}

		/**
		 *	First handle internal boundary positions.
		 */
		for (let n = 0; n < exponent; n++) {
			let step: number = 2 ** n;
			for (let i = 2 ** (n + 1); i < numberOfBoundaries - 1; i += 2 ** (n + 2)) {
				boundaryProbabilities[i] = boundaryProbabilities[i - step] + boundaryProbabilities[i + step];
				boundaryPositions[i] =
					(boundaryProbabilities[i - step] * boundaryPositions[i - step] +
						boundaryProbabilities[i + step] * boundaryPositions[i + step]) /
					boundaryProbabilities[i];
			}
		}

		/**
		 *	Above process might not produce a strictly increasing sequence of positions if not a valid TTR,
		 *	and it will leave 'None'-valued boundary points if the number of Dirac deltas is not a power of 2.
		 *	Handle both cases by sweeping over the boundary positions.
		 */
		for (let i = 2; i < numberOfBoundaries - 1; i += 2) {
			if (
				Number.isNaN(boundaryPositions[i]) ||
				boundaryPositions[i] <= boundaryPositions[i - 1] ||
				boundaryPositions[i] >= boundaryPositions[i + 1]
			) {
				boundaryPositions[i] =
					(boundaryProbabilities[i - 1] * boundaryPositions[i - 1] +
						boundaryProbabilities[i + 1] * boundaryPositions[i + 1]) /
					(boundaryProbabilities[i - 1] + boundaryProbabilities[i + 1]);
			}
		}

		/**
		 *	Initialize the binning and populate it for the internal bins.
		 */
		let numberOfBins: number = 2 * numberOfFiniteDiracDeltas;
		const binWidths: number[] = Array(numberOfBins).fill(NaN);
		const binHeights: number[] = Array(numberOfBins).fill(NaN);

		for (let i = 1; i < numberOfBins; i += 1) {
			binWidths[i] = boundaryPositions[i + 1] - boundaryPositions[i];
		}

		for (let i = 1; i < numberOfFiniteDiracDeltas - 1; i += 1) {
			const averageHeight: number = finiteSortedDiracDeltas[i].mass / (binWidths[2 * i] + binWidths[2 * i + 1]);
			binHeights[2 * i] = (averageHeight * binWidths[2 * i + 1]) / binWidths[2 * i];
			binHeights[2 * i + 1] = (averageHeight * binWidths[2 * i]) / binWidths[2 * i + 1];
		}

		/**
		 *	Now, handle the extremal bins.
		 *	First checking if (d/dx)^2 = 0 boundary condition has a solution.
		 *	If not, falling back to the boundary condition d/dx = 0.
		 *	First handling the left extreme bin.
		 */
		let w0: number = NaN;
		if (numberOfFiniteDiracDeltas >= 6) {
			const p0: number = boundaryProbabilities[1];
			const w1: number = binWidths[1];
			const w2: number = binWidths[2];
			const d2: number = binHeights[2];
			const a: number = d2 * w1 - p0;
			const b: number = a * w1 - p0 * w2;
			const c: number = p0 * w1 * (w1 + w2);
			const det: number = b * b - 4 * a * c;
			if (det >= 0) {
				/**
				 *	There are real roots. Pick the smallest positive root if there is one.
				 */
				const root1: number = (-b + Math.sqrt(det)) / (2 * a);
				const root2: number = (-b - Math.sqrt(det)) / (2 * a);
				if (root1 > 0 && root2 > 0) {
					w0 = Math.min(root1, root2);
				} else if (root1 > 0 || root2 > 0) {
					w0 = Math.max(root1, root2);
				}
			}
		}

		if (Number.isNaN(w0)) {
			/**
			 *	The boundary condition d/dx = 0.
			 */
			boundaryPositions[0] = boundaryPositions[1] - (boundaryPositions[2] - boundaryPositions[1]);
		} else {
			/**
			 *	The boundary condition (d/dx)^2 = 0.
			 */
			boundaryPositions[0] = boundaryPositions[1] - w0;
		}

		binWidths[0] = boundaryPositions[1] - boundaryPositions[0];
		let averageHeight: number = finiteSortedDiracDeltas[0].mass / (binWidths[0] + binWidths[1]);
		binHeights[0] = (averageHeight * binWidths[1]) / binWidths[0];
		binHeights[1] = (averageHeight * binWidths[0]) / binWidths[1];

		/**
		 * 	Now handling the right extreme bin.
		 */
		w0 = NaN;
		if (numberOfFiniteDiracDeltas >= 6) {
			const p0: number = boundaryProbabilities[boundaryProbabilities.length - 2];
			const w1: number = binWidths[binWidths.length - 2];
			const w2: number = binWidths[binWidths.length - 3];
			const d2: number = binHeights[binHeights.length - 3];
			const a: number = d2 * w1 - p0;
			const b: number = a * w1 - p0 * w2;
			const c: number = p0 * w1 * (w1 + w2);
			const det: number = b * b - 4 * a * c;
			if (det >= 0) {
				// There are real roots. Pick the smallest positive root if there is one.
				const root1: number = (-b + Math.sqrt(det)) / (2 * a);
				const root2: number = (-b - Math.sqrt(det)) / (2 * a);
				if (root1 > 0 && root2 > 0) {
					w0 = Math.min(root1, root2);
				} else if (root1 > 0 || root2 > 0) {
					w0 = Math.max(root1, root2);
				}
			}
		}

		if (Number.isNaN(w0)) {
			/**
			 *	The boundary condition d/dx = 0.
			 */
			const l: number = boundaryPositions.length;
			boundaryPositions[l - 1] = boundaryPositions[l - 2] + (boundaryPositions[l - 2] - boundaryPositions[l - 3]);
		} else {
			/**
			 *	The boundary condition (d/dx)^2 = 0.
			 */
			const l: number = boundaryPositions.length;
			boundaryPositions[l - 1] = boundaryPositions[l - 2] + w0;
		}

		const bwl: number = binWidths.length;
		const bhl: number = binHeights.length;
		const bpl: number = boundaryPositions.length;
		const fsddl: number = finiteSortedDiracDeltas.length;

		binWidths[bwl - 1] = boundaryPositions[bpl - 1] - boundaryPositions[bpl - 2];
		averageHeight = finiteSortedDiracDeltas[fsddl - 1].mass / (binWidths[bwl - 1] + binWidths[bwl - 2]);
		binHeights[bhl - 1] = (averageHeight * binWidths[bwl - 2]) / binWidths[bwl - 1];
		binHeights[bhl - 2] = (averageHeight * binWidths[bwl - 1]) / binWidths[bwl - 2];

		return [boundaryPositions, binWidths, binHeights];
	};

	/**
	 * 	Calculate plotting data for the distributional value in the form of histogram bins.
	 *
	 *	@param plottingResolution
	 *	@returns [boundaryPositions, binWidths, binHeights]
	 */
	public getPlotData = (plottingResolution: number = 64): [number[], number[], number[]] | undefined => {
		if (!this.isPowerOfTwo(plottingResolution)) {
			throw new Error('plotHistogramDiracDeltas: plotting_resolution must be a power of 2!');
		}
		const plottingTTROrder = Math.log2(plottingResolution) - 1;

		/**
		 *	Create the list of finite Dirac deltas.
		 */
		this.dropZeroMassPositions();
		this.sort();
		this.cure();

		/**
		 *	If no finite Dirac deltas found, then continue to the next dist.
		 */
		if (this.diracDeltaCount == null || this.diracDeltaCount <= 1) {
			return;
		}

		/**
		 *	Find the greatest exponent n such that 2^n divides the number of Dirac deltas.
		 */
		const exponent: number = this.findGreatestDivisorExponentOf2(this.diracDeltaCount);

		/**
		 *	Create the unique binning such that the average of two bins surrounding a Dirac delta is the Dirac delta.
		 *	If the input Dirac deltas form a valid TTR, then the TTR of the binning should exactly coincide with the input.
		 */
		const [boundaryPositions, binWidths, binHeights] = this.createBinning(this.diracDeltas, exponent);

		const ttrDiracDeltas: DiracDelta[] = this.binPDF2TTR(
			boundaryPositions,
			binWidths,
			binHeights,
			plottingTTROrder,
		);

		return this.createBinning(ttrDiracDeltas, plottingTTROrder);
	};
}
