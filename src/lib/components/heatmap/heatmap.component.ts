import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EChartsCoreOption, EChartsType } from 'echarts/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ECElementEvent } from 'echarts/core';
import { ECharts } from 'echarts/core';

@Component({
	selector: 'lib-heatmap',
	imports: [NgxEchartsDirective],
	templateUrl: './heatmap.component.html',
	styleUrl: './heatmap.component.css',
	providers: [
		{
			provide: NGX_ECHARTS_CONFIG,
			useFactory: () => ({ echarts }),
		},
	],
})
export class HeatmapComponent implements OnInit, OnChanges {
	@Input() dataArray: number[] = [];
	@Input() heatmapSize = { x: 32, y: 24 };
	@Output() onSelectedValue = new EventEmitter<ECElementEvent>();
	protected chartReadyData: number[][] = [];
	private chartInstance!: ECharts;

	protected options: EChartsCoreOption = {
		// grid: { left: '50px', right: '15px', top: '15px', bottom: '50px' },
		tooltip: {},
		xAxis: {
			type: 'category',
			data: Array.from(Array(this.heatmapSize.x).keys()),
			axisLabel: { show: false },
			axisTick: { show: false },
			axisLine: { show: false },
		},
		yAxis: {
			type: 'category',
			data: Array.from(Array(this.heatmapSize.y).keys()),
			axisLabel: { show: false },
			axisTick: { show: false },
			axisLine: { show: false },
		},

		visualMap: {
			type: 'piecewise',
			min: 0,
			show: false,
			max: 0.12,
			left: 'right',
			top: 'center',
			calculable: true,
			realtime: true,
			splitNumber: 1024,
			inRange: {
				color: ['#eeeeee', '#c7c3da', '#a19ac7', '#7c70b3', '#56479f', '#4b3f72'],
			},
		},
	};

	ngOnChanges(changes: SimpleChanges) {
		if (!changes['dataArray'].firstChange) {
			this.updateChartOptions();
			this.chartInstance.setOption(this.options);
		}
	}

	clicked(event: ECElementEvent) {
		this.onSelectedValue.emit(event);
	}

	ngOnInit() {
		this.updateChartOptions();
	}

	private updateChartOptions() {
    this.options['series'] = [
			{
				name: 'Gaussian',
				type: 'heatmap',
				data: this.constructDataForHeatMapFromArray(this.dataArray),
				legend: { show: false },
				emphasis: {
					itemStyle: {
						borderColor: '#333',
						borderWidth: 0,
					},
				},
			},
		];

	}

	private constructDataForHeatMapFromArray(input: number[]) {
		const indexMap: { [key in number]: number } = {};
    this.chartReadyData = [];
		for (let j = 0; j < this.heatmapSize.y; j++) {
			for (let i = this.heatmapSize.x - 1; i >= 0; i--) {
				const index = j * this.heatmapSize.x + i; // Corrected index formula
				this.chartReadyData.push([i, j, input[index]]);
				if (indexMap[index] == null) indexMap[index] = 0;
				indexMap[index]++;
			}
		}
		// @ts-ignore
		this.options.visualMap.max = Math.max(...input);
		// @ts-ignore
		this.options.visualMap.min = Math.min(...input);
		return this.chartReadyData;
	}

	initChart($event: ECharts) {
		this.chartInstance = $event;
	}
}
