import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
// @ts-ignore
import checkmark from '@carbon/icons/es/checkmark/32';
import { SnackbarData, SnackbarType } from '../components';
import WarningFilled from '@carbon/icons/es/warning--filled/32';
@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private snackbar = inject(MatSnackBar);
	constructor() {
	}

	private readonly typeToIcons: { [key in SnackbarType]: any } = {
		success: checkmark,
		neutral: '',
		error: WarningFilled,
		warning: '',
		primary: '',
	};


  private readonly typeToColor: { [key in SnackbarType]: string } = {
    success: 'var(--defaults-primary-background-primary, #0A0E15)',
    neutral: 'var(--defaults-primary-background-primary, #0A0E15)',
    error: 'var(--defaults-primary-icon-primary_inverse)',
    warning: 'var(--defaults-primary-background-primary, #0A0E15)',
    primary: 'var(--defaults-primary-background-primary, #0A0E15)',
  };

  private readonly typeToBackgroundColor: { [key in SnackbarType]: string } = {
    success: 'var(--defaults-primary-background-primary, #0A0E15)',
    neutral: 'var(--defaults-primary-background-primary, #0A0E15)',
    error: 'var(--alerts-error-background-error, #DB3E32)',
    warning: 'var(--defaults-primary-background-primary, #0A0E15)',
    primary: 'var(--defaults-primary-background-primary, #0A0E15)',
  };


  public removeSnackbar() {
    this.snackbar.dismiss();
  }
	openSnackbar(options: SnackbarData) {
		options.icon = this.typeToIcons[options.type];
    options.iconColor = this.typeToColor[options.type];
    options.iconBackgroundColor = this.typeToBackgroundColor[options.type];
		this.snackbar.openFromComponent(SnackbarComponent, {
			data: options,
			panelClass: 'testing-class',
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
