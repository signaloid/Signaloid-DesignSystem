import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import { DistributionPlotComponent } from '../distribution-plot/distribution-plot.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {NgClass} from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
	selector: 'lib-figure-container',
	templateUrl: './figure-container.component.html',
	styleUrl: './figure-container.component.css',
	imports: [DistributionPlotComponent, MatProgressSpinner, NgClass, SkeletonModule, ProgressSpinner],
})
export class FigureContainerComponent {
	@Input() imageSource: string = '';
	@Input() uxString: string = '';
	@Input() xAxisLabel: string = '';
	@Input() loading: boolean = false;
	@Input() suffix: string = '';
	@Input() prefix: string = '';
	@Input() percentageOfValueAtRisk: number | undefined;
	@Input() singleValue = false;
	constructor(private cd: ChangeDetectorRef) {}
}

