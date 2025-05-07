import { Component, inject, Inject } from '@angular/core';
import { CarbonIconComponent } from '../icon/icon.component';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/button.types';
// @ts-ignore
import close from '@carbon/icons/es/close/32';

@Component({
	selector: 'lib-snackbar',
	imports: [CarbonIconComponent, ButtonComponent],
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {}
	protected snackbarRef = inject(MatSnackBar);
	protected readonly ButtonType = ButtonType;
	protected readonly close = close;
}

export interface SnackbarData {
	header: string;
	actionLabel: string;
	type: SnackbarType;
	description?: string;
	icon?: unknown;
}
export type SnackbarType = 'primary' | 'neutral' | 'error' | 'success' | 'warning';
