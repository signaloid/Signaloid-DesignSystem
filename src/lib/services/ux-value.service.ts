import { Injectable } from '@angular/core';
import { DiracDelta, DistributionalValue } from '@signaloid/uxdata-tools';

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
		dist.scale = dist.scale ?? 1;

		// Calculate the scaled particle value
		const particle_value = dist.initialValue * dist.scale;

		// Convert distribution to dirac deltas
		let diracDeltas: DiracDelta[] = [];
		for (const [position, mass] of dist.initialDistribution) {
			if (mass <= 0) {
				continue;
			}

			const scaledPosition = position * dist.scale;
			diracDeltas.push(new DiracDelta({
				position: scaledPosition,
				mass: mass
			}));
		}

		let distributionalValue = new DistributionalValue({
			particle_value: particle_value,
			dirac_deltas: diracDeltas,
			double_precision: true,
		});
		distributionalValue.normalize_dirac_deltas();
		distributionalValue.interpolate(resampleToSize);

		// Create UX string for distribution
		const uxString = distributionalValue.toString();
		return uxString;
	}
}
