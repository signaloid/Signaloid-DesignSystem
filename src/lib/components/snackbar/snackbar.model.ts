export interface SnackbarData {
	header: string;
	type: SnackbarType;
	actionLabel?: string;
	description?: string;
	icon?: unknown;
	iconColor?: string;
	iconBackgroundColor?: string;
}
export type SnackbarType = 'primary' | 'neutral' | 'error' | 'success' | 'warning';
