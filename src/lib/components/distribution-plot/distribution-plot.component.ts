import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';
import { DistributionalValue } from '../../../project-kea-ux-data/distributionalValue';

@Component({
	selector: 'lib-distribution-plot',
	templateUrl: './distribution-plot.component.html',
	styleUrls: ['./distribution-plot.component.css'],
	imports: [NgxEchartsDirective],
	providers: [
		{
			provide: NGX_ECHARTS_CONFIG,
			useFactory: () => ({ echarts }),
		},
	],
})
export class DistributionPlotComponent implements OnInit {
	@Input() uxValue: string = '';
	distValue!: DistributionalValue;
	@Input() showDownloadButton = false;
	@Input() yAxisLabel = 'Probability Density';
	@Input() xAxisLabel = 'Distribution Support';
	@Input() loading = false;
	@Input() loaderCols = 4;
	@Input() showZoomSlider = false;

	chartOptions: EChartsOption = {};
	readonly nBins = 32;

	constructor() {}

	ngOnInit(): void {
		this.distValue = new DistributionalValue();
		this.distValue.parseHex(this.uxValue);
		this.buildChartOptions();
	}
	getExponent = (num: number): number => this.scientific(num)[1];

	buildChartOptions(): void {
		let [bp, bw, bh] = this.distValue.getPlotData?.() || [[], [], []];
		if (!bp.length || !bw.length || !bh.length) {
			[bp, bw, bh] = [[this.distValue.diracDeltas[0].position, this.distValue.diracDeltas[0].position], [0], [1]];
		}

		const minXExp = Math.min(...bp.map(this.getExponent));
		const minYExp = Math.min(...bh.map(this.getExponent));

		const normBP = bp.map((v) => this.normalize(v, minXExp));
		const normBW = bw.map((v) => this.normalize(v, minXExp));
		const normBH = bh.map((v) => this.normalize(v, minYExp));
		const normMean = this.distValue.mean != null ? this.normalize(this.distValue.mean, minXExp) : NaN;

		const dataPoints = normBP.map((val, i) => ({
			value: [val, normBP[i + 1], normBH[i], normBW[i] * normBH[i]],
		}));

		const range = Math.abs(normBP[normBP.length - 1] - normBP[0]);
		const xAxisMin = normBP[0] - range * 0.1;
		const xAxisMax = normBP[normBP.length - 1] + range * 0.1;

		this.chartOptions = {
			aria: { enabled: true },
			grid: { left: '50px', right: '15px', top: '15px', bottom: '50px' },
			xAxis: [
				{
					type: 'value' as const,
					// @ts-ignore
					position: 'bottom' as any,
					name: this.xAxisLabel,
					nameLocation: 'middle' as const,
					nameGap: 30,
					scale: true,
					splitLine: {
						lineStyle: {
							type: 'dotted',
							color: 'rgba(153, 153, 153, 0.67)',
						},
					},
				},
				...(minXExp !== 0
					? [
							{
								type: 'value' as const,
								// @ts-ignore
								position: 'bottom' as any,
								name: `1e${minXExp}`,
								nameLocation: 'end' as const,
								nameGap: 0,
								scale: false,
							},
						]
					: []),
			],
			yAxis: [
				{
					type: 'value' as const,
					position: 'left' as any,
					name: this.yAxisLabel,
					nameLocation: 'middle' as const,
					nameGap: 35,
					min: 0,
					scale: true,
					splitLine: {
						lineStyle: {
							type: 'dotted',
							color: 'rgba(153, 153, 153, 0.67)',
						},
					},
				},
				...(minYExp !== 0
					? [
							{
								type: 'value' as const,
								position: 'left' as any,
								name: `1e${minYExp}`,
								nameLocation: 'end' as const,
								nameGap: 0,
								scale: false,
								axisTick: { show: false },
								axisLabel: { show: false },
							},
						]
					: []),
			],
			series: [
				{
					type: 'custom',
					data: dataPoints,
					dimensions: ['from', 'to', 'height', 'mass'],
					encode: {
						x: [0, 1],
						y: 2,
					},
					renderItem: (params, api) => {
						const [x0, y0] = api.coord([api.value(0), 0]);
						const [x1, y1] = api.coord([api.value(1), api.value(2)]);
						return {
							type: 'rect',
							shape: {
								x: x0,
								y: y1,
								width: x1 - x0,
								height: y0 - y1,
							},
							style: {
								fill: 'rgba(51, 163, 51, 0.3)',
								stroke: 'rgba(51, 163, 51, 1)',
								lineWidth: 0.6,
							},
						};
					},
					markLine: {
						symbol: 'none',
						data: [
							{
								name: 'E(x)',
								xAxis: normMean,
								label: {
									show: true,
									formatter: '{b}',
									position: 'insideEndBottom',
								},
							},
						],
						lineStyle: {
							color: 'rgba(41, 120, 45, 0.4)',
							type: 'solid',
							width: 2,
						},
					},
					tooltip: {
						formatter: (params: any) => `Probability Mass<br/>${params.data.value[3]}`,
					},
				},
			],
		};
	}

	normalize(val: number, newExp: number): number {
		const [coef, origExp] = this.scientific(val);
		return coef * Math.pow(10, origExp - newExp);
	}

	scientific(num: number): [number, number] {
		const [c, e] = num.toExponential().split('e').map(Number);
		return [c, e];
	}
}
