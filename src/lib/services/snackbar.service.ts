import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent, SnackbarData, SnackbarType } from '../components/snackbar/snackbar.component';
// @ts-ignore
import checkmark from '@carbon/icons/es/checkmark/32';

//@ts-ignore
@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private snackbar = inject(MatSnackBar);
	constructor() {
		console.log(this.snackbar);
	}

	private readonly typeToIcons: { [key in SnackbarType]: any } = {
		success: checkmark,
		neutral: '',
		error: '',
		warning: '',
		primary: '',
	};

	openSnackbar(options: SnackbarData) {
		options.icon = this.typeToIcons[options.type];
		this.snackbar.openFromComponent(SnackbarComponent, {
			data: options,
			panelClass: 'testing-class',
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
