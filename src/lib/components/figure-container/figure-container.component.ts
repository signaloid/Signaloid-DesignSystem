import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { DistributionPlotComponent } from '../distribution-plot/distribution-plot.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
	selector: 'lib-figure-container',
	templateUrl: './figure-container.component.html',
	styleUrl: './figure-container.component.css',
	imports: [DistributionPlotComponent, MatProgressSpinner, SkeletonModule],
})
export class FigureContainerComponent {
	@Input() imageSource: string = '';
	@Input() uxString: string = '';
	@Input() xAxisLabel: string = '';
	@Input() loading: boolean = false;
	@Input() initialLoading: boolean = false;
	@Input() suffix: string = '';
	@Input() prefix: string = '';
	@Input() percentageOfValueAtRisk: number | undefined;
	@Input() singleValue = false;
	@Input() varValue: number | undefined;
	constructor(private cd: ChangeDetectorRef) {
	}
}
