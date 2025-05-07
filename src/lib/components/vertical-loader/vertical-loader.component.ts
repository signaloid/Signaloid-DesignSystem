import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CarbonIconComponent } from '../icon/icon.component';

export type StepStatus = 'pending' | 'inProgress' | 'done' | 'failed';
//@ts-ignore
import checkMark from '@carbon/icons/es/checkmark--filled/32';
//@ts-ignore
import error from '@carbon/icons/es/warning--filled/32';
export interface LoaderStep {
	identifier: string;
	label: string;
	status: StepStatus;
}

@Component({
	selector: 'lib-vertical-loader',
	templateUrl: './vertical-loader.component.html',
	styleUrls: ['./vertical-loader.component.css'],
	imports: [MatIcon, MatProgressSpinner, NgIf, MatButton, CarbonIconComponent],
})
export class VerticalLoaderComponent {
	/**
	 * The list of steps in the loader and their current status.
	 * Example:
	 * [
	 *   { label: 'Connecting repository', status: 'done' },
	 *   { label: 'Building repository',   status: 'inProgress' },
	 *   { label: 'Initiating task',       status: 'pending' },
	 *   { label: 'Running task',         status: 'pending' },
	 *   { label: 'Fetching task outputs', status: 'pending' },
	 * ]
	 */
	@Input() steps: LoaderStep[] = [];

	/**
	 * Emitted when the user clicks "Retry" on a failed step.
	 * You can catch this event in your parent to re-trigger the process or fix the error.
	 */
	@Output() retry = new EventEmitter<LoaderStep>();

	onRetry(step: LoaderStep): void {
		this.retry.emit(step);
	}

	protected readonly checkMark = checkMark;
	protected readonly error = error;
}
