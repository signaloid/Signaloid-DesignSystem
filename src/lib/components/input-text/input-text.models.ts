export enum InputTextSize {
	S = 'small',
	M = 'medium',
	L = 'large',
	XL = 'xLarge',
}

export interface InputMeasurements {
	height: number;
	fontSize: number;
}

export const InputTextSizes: { [key in InputTextSize]: InputMeasurements } = {
	[InputTextSize.S]: {
		height: 28,
		fontSize: 14,
	},
	[InputTextSize.M]: {
		height: 40,
		fontSize: 14,
	},
	[InputTextSize.L]: {
		height: 40,
		fontSize: 16,
	},
	[InputTextSize.XL]: {
		height: 44,
		fontSize: 16,
	},
};
