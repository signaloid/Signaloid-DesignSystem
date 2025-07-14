import { Component, Input } from '@angular/core';

import { DistributionPlotComponent } from '../distribution-plot/distribution-plot.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'lib-figure-container',
	templateUrl: './figure-container.component.html',
	styleUrl: './figure-container.component.css',
	imports: [DistributionPlotComponent, MatProgressSpinner],
})
export class FigureContainerComponent {
	@Input() imageSource: string = '';
	@Input() uxString: string = '';
  @Input() xAxisLabel: string = '';
	@Input() loading: boolean = false;
  @Input() suffix: string = '';
  @Input() prefix: string = '';
}
