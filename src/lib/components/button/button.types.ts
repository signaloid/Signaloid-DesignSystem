export enum ButtonType {
	Primary = 'primary',
	Secondary = 'secondary',
	Outlined = 'outlined',
	Destructive = 'danger',
}

export enum ButtonSize {
	S = 'small',
	M = 'medium',
	L = 'large',
	XL = 'xLarge',
}

export const ButtonSizes = {
	[ButtonSize.S]: {
		width: 123,
		height: 28,
		fontSize: 14,
	},
	[ButtonSize.M]: {
		width: 123,
		height: 40,
		fontSize: 14,
	},
	[ButtonSize.L]: {
		width: 136,
		height: 40,
		fontSize: 16,
	},
	[ButtonSize.XL]: {
		width: 144,
		height: 44,
		fontSize: 16,
	},
};
