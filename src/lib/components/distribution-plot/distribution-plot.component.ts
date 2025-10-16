import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';

import { YAXisOption } from 'echarts/types/dist/shared';
import { CurrencyPipe, NgClass } from '@angular/common';
import { DistributionalValue, PlotData } from '@signaloid/uxdata-tools-internal/dist/cjs';

const AXIS_STYLE = {
	axisLine: { show: true, onZero: false, lineStyle: { type: 'solid' as const, width: 1.5, color: '#000' } },
	axisTick: { show: true, inside: true, lineStyle: { type: 'solid' as const, width: 1, color: '#000' } },
	minorTick: { show: true, lineStyle: { type: 'solid' as const, width: 1, color: '#383838' } },
	axisLabel: { color: '#000' },
};

const AXIS_NAME_STYLE = {
	color: '#000',
	fontSize: 12,
	fontWeight: 400,
};

const ARIA_CONFIG = {
	enabled: true,
	decal: {
		show: true,
		decals: [
			{
				color: 'rgba(51, 163, 51, 0.8)',
				dashArrayX: [1, 0],
				dashArrayY: [2, 8],
				symbolSize: 0.6,
				rotation: Math.PI / 4,
			},
		],
	},
};

@Component({
	selector: 'lib-distribution-plot',
	templateUrl: './distribution-plot.component.html',
	styleUrls: ['./distribution-plot.component.css'],
	imports: [NgxEchartsDirective, CurrencyPipe, NgClass], // Ensure NgxEchartsDirective and your pipe are imported
	standalone: true,
	providers: [
		{
			provide: NGX_ECHARTS_CONFIG,
			useFactory: () => ({ echarts }),
		},
	],
})
export class DistributionPlotComponent implements OnInit, OnChanges {
	@Input() uxValue: string = '';
	distValue!: DistributionalValue;
	@Input() yAxisLabel = 'Probability Density';
	@Input() xAxisLabel = 'Distribution Support';
	@Input() suffix = '';
	@Input() prefix = '';
	@Input() percentageOfValueAtRisk: number | undefined;
	@Input() hasSingleValue = false;
	protected particleValue: number | null = null;
	private hasColoring = false;
	chartOptions: EChartsOption = {};

	ngOnInit(): void {
		this.hasColoring = this.percentageOfValueAtRisk !== undefined;
		this.updateChartData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['uxValue']) {
			this.hasColoring = this.percentageOfValueAtRisk !== undefined;
			console.log(this.hasColoring);
			this.updateChartData();
		} else if (changes?.['percentageOfValueAtRisk']) {
			this.hasColoring = this.percentageOfValueAtRisk !== undefined;
			this.updateChartData();
		}
	}

	private updateChartData(): void {
		try {
			const dist = DistributionalValue.parse(this.uxValue);
			if (dist === null) {
				this.chartOptions = {}; // Clear chart on error
				return;
			}
			this.distValue = dist;
			this.particleValue = this.distValue.particle_value; // Set the particleValue for the template
			this.buildChartOptions();
		} catch (error) {
			this.chartOptions = {}; // Clear chart on error
		}
	}

	private buildChartOptions(): void {
		if (this.distValue?.UR_order === 1) {
			this.chartOptions = this.buildDiracArrowOptions();
		} else {
			this.chartOptions = this.buildHistogramOptions();
		}
	}

	private buildDiracArrowOptions(): EChartsOption {
		const position = this.distValue?.mean ?? 0;
		const minXExp = this.getExponent(position);

		const normMean = this.normalize(position, minXExp);

		const range = Math.floor(Math.abs(normMean * 0.2 || 1));
		const xAxisMin = normMean - range;
		const xAxisMax = normMean + range;

		return {
			aria: ARIA_CONFIG,
			grid: { left: '50px', right: '30px', top: '25px', bottom: '50px' },
			xAxis: this.getHistogramXAxes(xAxisMin, xAxisMax, minXExp),
			graphic: {
				elements: this.hasColoring
					? [
							{
								type: 'text',
								left: '50%',
								top: '40%',
								style: {
									text: `${((1 - Number(this.percentageOfValueAtRisk)) * 100).toFixed(0)} % Confidence`,
									font: '14px sans-serif',
									fill: 'rgba(0, 0, 0, 0.8)',
								},
							},
						]
					: [],
			},
			yAxis: [
				{
					...AXIS_STYLE,
					type: 'value' as const,
					// Add the name and styling to match the histogram view
					name: 'Probability Mass',
					nameLocation: 'middle' as const,
					nameGap: 35,
					nameTextStyle: AXIS_NAME_STYLE,
					// Add the splitLine grid lines
					splitLine: {
						lineStyle: { type: 'dotted', color: 'rgba(153, 153, 153, 0.67)' },
					},
					min: 0,
					max: 1.2,
				},
			],
			series: [
				// Series for the arrowhead
				{
					type: 'custom',
					data: [normMean],
					renderItem: (params, api) => ({
						type: 'polygon',
						x: api.coord([api.value(0), 1])[0],
						y: api.coord([api.value(0), 1])[1],
						shape: {
							points: [
								[0, 0],
								[-6, 10],
								[6, 10],
							],
						},
						style: { fill: '#000' },
					}),
				},
				// Series for the arrow's vertical line
				{
					type: 'custom',
					data: [normMean],

					renderItem: (params, api) => ({
						type: 'polyline',
						areaStyle: {
							color: '#000',
							opacity: 0.5,
						},
						shape: {
							points: [api.coord([api.value(0), 0]), api.coord([api.value(0), 1])],
						},
						style: { stroke: 'rgba(41, 120, 45, 0.4)' },
					}),
				},
				// Invisible scatter series for the E(x) label
				{
					type: 'scatter',
					data: [[normMean, 1.0]],
					symbolSize: 0,
					zlevel: 1,
					label: {
						show: true,
						formatter: 'E(x)',
						position: 'top',
						distance: 5,
						color: '#000',
						fontSize: 12,
					},
				},
			],
		};
	}

	private buildHistogramOptions(): EChartsOption {
		const plotData = new PlotData(this.distValue, 64);

		const [bp, bw, bh] = [plotData.positions, plotData.widths, plotData.masses];
		const minXExp = this.getExponent(plotData.max_range / 2) - 1;

		const minYExp = this.getExponent(plotData.max_value / 2) - 1;

		const normBP = bp.map((v) => this.normalize(v, minXExp));
		const normMean = this.distValue.mean != null ? this.normalize(this.distValue.mean, minXExp) : NaN;

		const range = Math.abs(normBP[normBP.length - 1] - normBP[0]);
		const xAxisMin = Math.min(...normBP);
		const xAxisMax = Math.max(...normBP);
		const valueAtRisk = this.percentageOfValueAtRisk ? this.percentageOfValueAtRisk * xAxisMax : undefined;
		return {
			grid: { left: '50px', right: '30px', top: '25px', bottom: '50px' },
			aria: ARIA_CONFIG,
			xAxis: this.getHistogramXAxes(xAxisMin, xAxisMax, minXExp),
			yAxis: this.getHistogramYAxes(minYExp),
			series: this.getHistogramSeries(normBP, bh, bw, minXExp, normMean, valueAtRisk),
		};
	}

	private getHistogramXAxes(min: number, max: number, minXExp: number): EChartsOption['xAxis'] {
		const baseAxis = {
			...AXIS_STYLE,
			type: 'value' as const,
			z: 10,
			scale: true,
			splitLine: { lineStyle: { type: 'dotted', color: 'rgba(153, 153, 153, 0.67)' } },
			min,
			max,
			// Suggest 4 grid lines, which encourages "nicer" tick intervals
			splitNumber: 4,
			// Add a formatter to ensure clean labels
			axisLabel: {
				color: '#000',
				formatter: (value: number) => value.toFixed(1),
			},
		};

		const axes: any[] = [
			{
				...baseAxis,
				position: 'bottom' as const,
				name: this.xAxisLabel,
				nameLocation: 'middle' as const,
				nameGap: 30,
				nameTextStyle: AXIS_NAME_STYLE,
			},
			{
				...baseAxis,
				position: 'top' as const,
				axisLabel: { show: false }, // Keep top labels hidden
			},
		];

		if (minXExp !== 0) {
			axes.push({
				type: 'value' as const,
				position: 'bottom' as const,
				name: `1e${minXExp}`,
				nameLocation: 'end' as const,
				nameTextStyle: { ...AXIS_NAME_STYLE, color: '#000' },
				nameGap: 5,
				scale: false,
			});
		}
		return axes;
	}

	private getHistogramYAxes(minYExp: number): EChartsOption['yAxis'] {
		let axes: YAXisOption[] = [
			{
				...AXIS_STYLE,
				type: 'value' as const,
				position: 'left' as const,
				name: this.yAxisLabel,
				nameLocation: 'middle' as const,
				axisLine: { show: false, onZero: false },
				axisTick: { show: false },
				minorTick: { show: false },
				nameGap: 35,
				min: 0,
				nameTextStyle: AXIS_NAME_STYLE,
				scale: true,
				splitLine: { lineStyle: { type: 'dotted', color: 'rgba(153, 153, 153, 0.67)' } },
				axisLabel: {
					color: '#000',
					// This formatter uses minYExp to calculate the correct label value.
					formatter: (value: number) => {
						if (value === 0) {
							return '0';
						}
						// Divide the raw value by the exponent to get the scaled value.
						// e.g., 0.000090 / 1e-6 = 90
						const scaledValue = value / Math.pow(10, minYExp);
						return scaledValue.toFixed(0); // Show as an integer (e.g., "90")
					},
				},
			},
		];
		if (minYExp !== 0) {
			axes.push({
				type: 'value' as const,
				position: 'left' as const,
				name: `1e${minYExp}`,
				nameLocation: 'end' as const,
				nameGap: 10,
				nameTextStyle: { color: '#000' },
				scale: false,
				axisLine: { show: false, onZero: false },
				axisTick: { show: false },
				axisLabel: { show: false },
			});
		}

		console.log(axes);

		return axes;
	}

	private getHistogramSeries(
		normBP: number[],
		normBH: number[],
		normBW: number[],
		minXExp: number,
		normMean: number,
		normValueAtRisk: number | undefined,
	): EChartsOption['series'] {
		const dataPoints = normBP.map((val, i) => ({
			value: [val, normBP[i + 1], normBH[i], normBW[i] * normBH[i]],
		}));
		return [
			{
				xAxisIndex: 0,
				type: 'custom',
				data: dataPoints,
				dimensions: ['from', 'to', 'height', 'mass'],
				encode: { x: [0, 1], y: 2 },
				renderItem: (params, api) => {
					const fromX = api.value(0);
					const toX = api.value(1);
					const height = api.value(2);
					const topLeft = api.coord([fromX, height]);
					const bottomRight = api.coord([toX, 0]);
					const width = bottomRight[0] - topLeft[0];
					const heightInPixels = bottomRight[1] - topLeft[1];

					return {
						type: 'rect',
						shape: { x: topLeft[0], y: topLeft[1], width: width, height: heightInPixels },
						style: {
							fill: 'rgba(51, 163, 51, 0.3)',
							stroke: 'rgba(51, 163, 51, 1)',
							lineWidth: 0.6,
							// This line applies the decal to the rectangle
							decal: api.visual('decal'),
						},
					};
				},
				markLine: this.getMarkLine(normMean, normValueAtRisk),
				markArea: this.hasColoring
					? {
							itemStyle: {
								opacity: 0.25,
							},
							data: [
								// Red area (Loss region)
								[
									{
										xAxis: 'min', // from the start of the axis
										itemStyle: { color: '#d9534f' },
									},
									{
										xAxis: normValueAtRisk,
									},
								],
								// Green area (Confidence region)
								[
									{
										name: `${((1 - Number(this.percentageOfValueAtRisk)) * 100).toFixed(0)} % Confidence`,
										xAxis: normValueAtRisk,
										itemStyle: { color: '#91cc75' },
									},
									{
										xAxis: 'max', // to the end of the axis
									},
								],
							],
						}
					: {},
				tooltip: {
					formatter: (params: any) => `Probability Mass<br/>${params.data.value[3]}`,
				},
			},
		];
	}
	private getExponent = (num: number): number => this.scientific(num)[1];

	private getMarkLine(normMean: number, normValueAtRisk: number | undefined): echarts.MarkLineComponentOption {
		if (!this.hasColoring) {
			return {
				animation: false,
				symbol: 'none',
				data: [
					{
						name: 'E(x)',
						xAxis: normMean,
						label: {
							show: true,
							position: 'insideEndTop',
							formatter: '{b}',
						},
					},
				],
				lineStyle: { color: 'rgba(41, 120, 45, 0.4)', type: 'solid', width: 2 },
			};
		}
		return {
			animation: false,
			symbol: 'none',
			data: [
				{
					name: 'E(x)',
					xAxis: normMean,
					label: {
						show: true,
						position: 'insideEndTop',
						formatter: '{b}',
					},
				},
				{
					name: 'VaR',
					xAxis: normValueAtRisk ? normValueAtRisk : 0,
					lineStyle: { color: 'black', width: 2 },
					label: {
						show: true,
						position: 'insideStartTop',
						formatter: '{b}',
					},
				},
			],

			lineStyle: { color: 'rgba(41, 120, 45, 0.4)', type: 'solid', width: 2 },
		};
	}

	private normalize(val: number, newExp: number): number {
		const [coef, origExp] = this.scientific(val);
		return coef * Math.pow(10, origExp - newExp);
	}

	private scientific(num: number): [number, number] {
		const [c, e] = num.toExponential().split('e').map(Number);
		return [c, e];
	}
}
