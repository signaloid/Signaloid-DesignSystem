import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DistributionSliderComponent } from '../distribution-slider/distribution-slider.component';
// @ts-ignore
import ChartColumn from '@carbon/icons/es/chart--column/16.js';
// @ts-ignore
import SettingsAdjust from '@carbon/icons/es/settings--adjust/16';
import { ButtonGroupComponent } from '../button-group/button-group.component';
import { SliderComponent } from '../slider/slider.component';

@Component({
	selector: 'lib-distribution-plot-container',
	imports: [DistributionSliderComponent, ButtonGroupComponent, SliderComponent],
	templateUrl: './distribution-plot-container.component.html',
	styleUrl: './distribution-plot-container.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
})
export class DistributionPlotContainerComponent implements AfterViewInit, OnInit {
	inputOptionsDefaultValue = 'distribution';
	@Input() title: string = '';
	@Input() min!: number;
	@Input() max!: number;
	@Input() step!: number;
	@Input() initialValue!: number;
	@Input() disabled: boolean = false;
	@Input() initialDistribution!: [number, number][] | number[][]; // weight in [0..100]
	@Input() gridSteps!: number;
	@Input() graphHeight!: number;
	@Input() graphWidth: number = 550;
	@Input() canCollapse: boolean = true;
	@Input() collapsed: boolean = false;
	@Input() xAxisLabel?: string;
	@Input() yAxisLabel?: string;
	@Input() adjustWidthToSlidersCount: boolean = false;
	@Input() showBottomTitle = true;
	@Input() inputOptionValue = this.inputOptionsDefaultValue;
	@Input() showSliderToggleButton = true;
	@Output() switchedMode = new EventEmitter<'distribution' | 'slider'>();
	@Output() distributionChangeInner = new EventEmitter<{
		distribution: [number, number][];
		value: number;
	}>();
	@Output() sliderChangeInner = new EventEmitter<number>();
	distributionCenterValue: number = 0;
	inputOptions = [
		{
			value: 'distribution',
			icon: ChartColumn,
		},
		{
			value: 'slider',
			icon: SettingsAdjust,
		},
	];
	showingTooltip = false;

	ngOnInit() {
		this.distributionCenterValue = this.initialValue;
	}

	get calculateGraphWidth(): number | undefined {
		if (this.adjustWidthToSlidersCount) {
			const slidersLength = (this.max - this.min) / this.step;
			return slidersLength * 20 + 100;
		}
		return this.graphWidth;
	}
	ngAfterViewInit() {
		this.inputOptionsDefaultValue = 'distribution';
		this.inputOptionValue = this.inputOptionsDefaultValue;
		this.showingTooltip = false;
	}
	public onDistributionChange(event: { distribution: [number, number][]; value: number }) {
		this.distributionCenterValue = event.value;
		this.distributionChangeInner.emit(event);
	}
	showTooltip() {
		this.showingTooltip = true;
	}
	hideTooltip() {
		this.showingTooltip = false;
	}
	onChangeView(value: string) {
		this.switchedMode.emit(value as 'distribution' | 'slider');
		this.inputOptionValue = value;
	}
	onLockedChange(isLocked: boolean) {
		this.showBottomTitle = isLocked;
	}
	onSliderChangeInner(event: number) {
		this.sliderChangeInner.emit(event);
	}
	sliderChange(value: number) {
		this.sliderChangeInner.emit(value);
	}
}
