import { Component, Input } from '@angular/core';

import { DistributionPlotComponent } from '../distribution-plot/distribution-plot.component';

@Component({
	selector: 'lib-figure-container',
	templateUrl: './figure-container.component.html',
	styleUrl: './figure-container.component.css',
	imports: [DistributionPlotComponent],
})
export class FigureContainerComponent {
	@Input() imageSource: string = '';
	@Input() uxString: string = '';
}
