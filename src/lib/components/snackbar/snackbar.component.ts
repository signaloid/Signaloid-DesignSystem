import { Component, inject } from '@angular/core';
import { CarbonIconComponent } from '../icon/icon.component';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/button.types';
// @ts-ignore
import close from '@carbon/icons/es/close/32';
import { SnackbarData } from './snackbar.model';

@Component({
	selector: 'lib-snackbar',
	imports: [CarbonIconComponent, ButtonComponent],
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
	public data: SnackbarData = inject(MAT_SNACK_BAR_DATA);
	protected snackbarRef = inject(MatSnackBar);
	protected readonly ButtonType = ButtonType;
	protected readonly close = close;
}
