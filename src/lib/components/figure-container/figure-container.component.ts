import {ChangeDetectorRef, Component, Input} from '@angular/core';

import { DistributionPlotComponent } from '../distribution-plot/distribution-plot.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {NgClass} from '@angular/common';

@Component({
	selector: 'lib-figure-container',
	templateUrl: './figure-container.component.html',
	styleUrl: './figure-container.component.css',
	imports: [DistributionPlotComponent, MatProgressSpinner, NgClass],
})
export class FigureContainerComponent {
	@Input() imageSource: string = '';
	@Input() uxString: string = '';
	@Input() xAxisLabel: string = '';
	@Input() loading: boolean = false;
	@Input() suffix: string = '';
	@Input() prefix: string = '';
  @Input() percentageOfValueAtRisk: number | undefined;
	singleValue = false;
  constructor(private cd: ChangeDetectorRef) {
  }
	applyStylesIfSingleValue(value: boolean) {
		this.singleValue = value;
    this.cd.detectChanges();
	}
}

