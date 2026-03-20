import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputTextSize } from '../input-text/input-text.models';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ButtonSize } from '../button/button.types';
import { BigNumbersPipe } from '../../pipes';

interface DistributionPoint {
	x: number;
	y: number;
}

@Component({
	selector: 'lib-distribution-slider',
	templateUrl: './distribution-slider.component.html',
	imports: [NgForOf, NgIf, DecimalPipe, InputTextComponent, ReactiveFormsModule, ButtonComponent, BigNumbersPipe],
	standalone: true,
	styleUrls: ['./distribution-slider.component.scss'],
})
export class DistributionSliderComponent implements OnInit, OnChanges, AfterViewInit {
	@ViewChild('svgRef') svgRef!: ElementRef<SVGElement>;

	@Input() min!: number;
	@Input() max!: number;
	@Input() step!: number;
	@Input() initialValue!: number;
	@Input() initialDistribution!: [number, number][] | number[][]; // weight in [0..100]
	@Input() gridSteps!: number;
	@Input() graphHeight!: number;
	@Input() graphWidth!: number;
	@Input() canCollapse: boolean = true;
	@Input() collapsed: boolean = false;
	@Input() xAxisLabel?: string;
	@Input() yAxisLabel?: string;
	@Input() disabled: boolean = false;
	@Output() distributionChange = new EventEmitter<{
		distribution: [number, number][];
		value: number;
	}>();
	@Output() onUpdatingValues = new EventEmitter<boolean>();
	@Output() valueChange = new EventEmitter<number>();
	@Output() collapse = new EventEmitter<void>();
	hoveredElementIndex = -1;
	graphOpacity = 1;
	maximumSliders = 25;
	minimumSliders = 8;
	valuesFormGroup: FormGroup = new FormGroup({
		min: new FormControl('', [Validators.pattern('^[0-9]+(\.[0-9]+)?$'), Validators.required]),
		max: new FormControl('', [Validators.pattern('^[0-9]+(\.[0-9]+)?$'), Validators.required]),
		step: new FormControl('', [Validators.pattern('^[0-9]+(\.[0-9]+)?$'), Validators.required]),
	});
	updatingMinMaxStepValues = false;
	clientArea = {
		width: 0,
		height: 0,
	};

	safeArea = {
		width: 0,
		height: 0,
		topLeft: { x: 0, y: 0 },
		topRight: { x: 0, y: 0 },
		bottomLeft: { x: 0, y: 0 },
		bottomRight: { x: 0, y: 0 },
	};

	padding = {
		top: 20,
		bottom: 10,
		left: 60,
		right: -150,
	};

	selectedPoint: number | null = null;
	selectedCenterPoint: boolean = false;
	valueState: number = 0;
	distributionState: [number, number][] | number[][] = [];
	constructor() { }

	pointTracking(index: number, point: DistributionPoint) {
		return `${index} ${point.x} ${point.y}`;
	}

	ngOnInit(): void {
		this.valueState = this.initialValue;
		this.distributionState = this.initialDistribution.map(([x, y]) => [x, y / 100]);
		this.performInitialChecks();
		this.valuesFormGroup.addValidators(this.slidersValidator());
	}

	ngAfterViewInit(): void {
		// After the View is initialized, we can measure the SVG
		this.updateMeasurements();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['collapsed'] && !changes?.['collapsed'].firstChange) {
			this.updateDistribution();
		}
		if (changes?.['initialValue']) {
			this.moveCenterPoint(changes['initialValue'].currentValue, false, true);
		}
	}

	private performInitialChecks() {
		if (this.initialDistribution.length === 0) {
			return;
		}

		const xAxisValues = this.initialDistribution.map(([x, y]) => x);
		if (!xAxisValues.includes(this.initialValue)) {
			throw new Error('Initial value must be included in initialDistribution');
		}

		if (this.min > this.max) {
			throw new Error('min must be less than max');
		}

		if (this.step <= 0) {
			throw new Error('step must be greater than 0');
		}
	}

	// Whenever window is resized, recalc measurements
	@HostListener('window:resize')
	onWindowResize() {
		this.updateMeasurements();
	}

	get svgHeight(): number {
		return this.graphHeightProp + 55;
	}

	get svgWidth(): number {
		if (!this.graphWidth) return 500;
		return this.graphWidth + 25;
	}

	get graphHeightProp(): number {
		return this.collapsed
			? this.padding.top + this.padding.bottom
			: this.padding.top + this.graphHeight + this.padding.bottom;
	}

	/** Returns an array of lines for the grid */
	get gridLines() {
		const lines = [];
		const gridLineHeight = this.safeArea.height / this.gridSteps;
		const valueStep = this.roundToDecimalPlaces(100 / this.gridSteps, 0);
		for (let i = 0; i < this.gridSteps; i++) {
			lines.push({
				index: i,
				x1: this.safeArea.topLeft.x,
				y1: this.safeArea.topLeft.y + i * gridLineHeight,
				x2: this.safeArea.topRight.x,
				y2: this.safeArea.topRight.y + i * gridLineHeight,
				value: 100 - i * valueStep,
			});
		}
		return lines;
	}

	/** All discrete points across [min..max..step] with distribution [0..1] */
	get points(): [number, number][] {
		const min = Number(this.min);
		const max = Number(this.max);
		const step = Number(this.step);
		const stepCount = Math.round((max - min) / step);
		const decimalPlaces = this.countDecimalPlaces(step);
		const allPoints: [number, number][] = [];

		for (let i = 0; i <= stepCount; i++) {
			let currentValue = min + i * step;
			currentValue = this.roundToDecimalPlaces(currentValue, decimalPlaces);

			const distVal = this.distributionState.find((d) => d[0] === currentValue);
			if (distVal) {
				allPoints.push([currentValue, distVal[1]]);
			} else {
				allPoints.push([currentValue, 0]);
			}
		}

		return allPoints;
	}

	/** Returns an array of (x,y) coordinates for each point in the chart */
	get pointList(): DistributionPoint[] {
		if (this.points.length <= 1) return [];
		const spacing = this.safeArea.width / this.points.length;

		const points = this.points.map(([_, weight], index) => {
			return {
				x: this.safeArea.topLeft.x + index * spacing,
				y: this.safeArea.topLeft.y + (this.safeArea.height - weight * this.safeArea.height),
			};
		});
		return points;
	}

	/** The path string used in `<path d="M ... L ... Z">` for the distribution area */
	get pointPath(): string {
		return this.pointList.map((p) => `${p.x} ${p.y}`).join(' L ');
	}

	/** The center point coordinates corresponding to `valueState` */
	get centerPoint() {
		const idx = this.points.findIndex((p) => p[0] === this.valueState);
		if (idx === -1) {
			return { x: 0, y: 0 };
		}
		return this.pointList[idx];
	}

	get centerPointIndex() {
		return this.points.findIndex((p) => p[0] === this.valueState);
	}

	toggleLocked() {
		this.updateMeasurements();
		this.onUpdatingValues.emit(this.updatingMinMaxStepValues);
		this.updatingMinMaxStepValues = !this.updatingMinMaxStepValues;
		this.updatingMinMaxStepValues ? (this.graphOpacity = 0.5) : (this.graphOpacity = 1);
	}

	// ------------------------------------
	// EVENT HANDLERS (Mimicking Vue methods)
	// ------------------------------------

	onPointMouseDown(event: MouseEvent | TouchEvent, index: number) {
		event.preventDefault();
		if (this.disabled) return;
		this.selectedPoint = index;
	}

	onCenterPointMouseDown(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (this.disabled) return;
		this.selectedCenterPoint = true;
	}

	onMouseMove(event: MouseEvent) {
		if (this.disabled) return;
		this.movePoint(event.offsetY);
		this.moveCenterPoint(event.offsetX);
	}

	onMouseUp() {
		this.hoveredElementIndex = -1;
		if (this.selectedPoint == null && !this.selectedCenterPoint) {
			return;
		}
		if (this.selectedCenterPoint) {
			this.valueChange.emit(this.valueState);
		}
		this.selectedPoint = null;
		this.selectedCenterPoint = false;

		// finalize changes and emit
		this.updateDistribution();
	}

	onTouchMove(event: TouchEvent) {
		if (!this.svgRef || (this.selectedPoint == null && !this.selectedCenterPoint)) {
			return;
		}
		event.preventDefault();

		const rect = this.svgRef.nativeElement.getBoundingClientRect();
		const offsetX = event.touches[0].clientX - rect.x;
		const offsetY = event.touches[0].clientY - rect.y;

		this.movePoint(offsetY);
		this.moveCenterPoint(offsetX);
	}

	onTouchEnd() {
		this.onMouseUp();
	}

	updateMeasurements() {
		if (!this.svgRef?.nativeElement) return;

		const clientRect = this.svgRef.nativeElement.getBoundingClientRect();
		const newWidth = clientRect.width;
		const newHeight = this.graphHeightProp; // dynamic

		const newSafeAreaWidth = newWidth + (this.padding.left + this.padding.right);
		const newSafeAreaHeight = newHeight - (this.padding.top + this.padding.bottom);

		// Only update if changed
		if (
			this.clientArea.width !== newWidth ||
			this.clientArea.height !== newHeight ||
			this.safeArea.width !== newSafeAreaWidth ||
			this.safeArea.height !== newSafeAreaHeight
		) {
			this.clientArea.width = newWidth;
			this.clientArea.height = newHeight;

			this.safeArea.width = newSafeAreaWidth;
			this.safeArea.height = newSafeAreaHeight;

			this.safeArea.topLeft = { x: this.padding.left, y: this.padding.top };
			this.safeArea.topRight = {
				x: this.padding.left + newSafeAreaWidth,
				y: this.padding.top,
			};
			this.safeArea.bottomLeft = {
				x: this.padding.left,
				y: this.padding.top + newSafeAreaHeight,
			};
			this.safeArea.bottomRight = {
				x: this.padding.left + newSafeAreaWidth,
				y: this.padding.top + newSafeAreaHeight,
			};
		}
	}

	movePoint(offsetY: number) {
		if (this.selectedPoint == null) return;

		// Which actual distribution point is selected?
		const p = this.points[this.selectedPoint];
		if (!p) return;

		let value = 1 - (offsetY - this.padding.top) / this.safeArea.height;
		value = Math.min(1, Math.max(0, value));

		// Update distributionState
		const distIndex = this.distributionState.findIndex((d) => d[0] === p[0]);
		if (distIndex === -1) {
			this.distributionState.push([p[0], value]);
		} else {
			this.distributionState[distIndex][1] = value;
		}
	}

	/** Called when the user drags the center point horizontally */
	moveCenterPoint(offsetX: number, manual = false, changedFromSlider = false) {
		if (this.disabled) return;
		if (!changedFromSlider) {
			if (!this.selectedCenterPoint && !manual) {
				return;
			}
		}
		const decimalPlaces = this.countDecimalPlaces(this.step);
		let mappedValue = this.map(
			offsetX,
			this.safeArea.bottomLeft.x,
			this.safeArea.bottomRight.x,
			this.min,
			this.max,
		);
		if (changedFromSlider) {
			mappedValue = offsetX;
		}

		let roundedValue = Math.round(mappedValue / this.step) * this.step;
		if (roundedValue < this.min || roundedValue > this.max) return;
		roundedValue = this.roundToDecimalPlaces(roundedValue, decimalPlaces);
		const valueShift = this.roundToDecimalPlaces(roundedValue - this.valueState, decimalPlaces);

		if (changedFromSlider) {
			this.valueState = offsetX;
		} else {
			this.valueState = roundedValue;
		}
		if (valueShift === 0) return;

		this.distributionState.forEach((d) => {
			d[0] = this.roundToDecimalPlaces(d[0] + valueShift, decimalPlaces);
			if (d[0] < this.min || d[0] > this.max) {
				d[1] = 0;
			}
		});
	}

	updateDistribution() {
		const decimalPlaces = Math.max(2, this.countDecimalPlaces(this.step));
		if (this.collapsed) {
			this.distributionChange.emit({
				distribution: [[this.roundToDecimalPlaces(this.valueState, decimalPlaces), 100]],
				value: this.roundToDecimalPlaces(this.valueState, decimalPlaces),
			});
			return;
		}

		const fullDistribution = this.points.map(([x, w]) => [
			this.roundToDecimalPlaces(x, decimalPlaces),
			Math.round(w * 100),
		]) as [number, number][];

		const firstIndex = fullDistribution.findIndex((p) => p[1] !== 0);

		if (firstIndex === -1) {
			this.distributionChange.emit({
				distribution: fullDistribution,
				value: this.roundToDecimalPlaces(this.valueState, decimalPlaces),
			});
			return;
		}

		const lastIndexReversed = [...fullDistribution].reverse().findIndex((p) => p[1] !== 0);
		const sliceEnd = fullDistribution.length - lastIndexReversed;
		const distribution = fullDistribution.slice(firstIndex, sliceEnd).map((elem) => {
			if (elem[1] === 0) {
				elem[1] = 1e-16;
			}
			return elem;
		});
		this.distributionChange.emit({
			distribution,
			value: this.roundToDecimalPlaces(this.valueState, decimalPlaces),
		});
	}

	// ------------------------------------
	// HELPER FUNCTIONS
	// ------------------------------------
	/** Count the number of decimal places in a number */
	countDecimalPlaces(num: number): number {
		const str = num.toString();
		const index = str.indexOf('.');
		return index === -1 ? 0 : str.length - index - 1;
	}

	/** Rounds a number to a specific number of decimal places */
	roundToDecimalPlaces(num: number, decimalPlaces: number): number {
		const factor = Math.pow(10, decimalPlaces);
		return Math.round(num * factor) / factor;
	}

	/** Map a value from one range to another */
	map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
		return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
	}

	getPointClass(i: number) {
		return this.points.findIndex((p) => p[0] === this.valueState) === i;
	}

	updateDistributionValues(event: Event) {
		event.preventDefault();
		const { min, max, step } = this.valuesFormGroup.value;
		this.min = min;
		this.max = max;
		this.step = step;
		this.initialValue = 0;
		this.valueState = 0;
		this.clear();
		this.toggleLocked();
	}

	public slidersValidator() {
		return (group: AbstractControl) => {
			const min = group.get('min');
			const max = group.get('max');
			const step = group.get('step');
			if (!min || !max || !step) return null;

			const slidersCount = Math.round((max.value - min.value) / step.value);
			if (slidersCount > this.maximumSliders) {
				step.setErrors({
					tooClose: true,
				});
				return { tooClose: true };
			} else if (slidersCount < this.minimumSliders) {
				step.setErrors({
					tooFew: true,
				});
				return { tooFew: true };
			}
			return null;
		};
	}

	public clear() {
		// Set all distribution values to zero
		this.distributionState = this.points.map(([x, _]) => [x, 0]);
		this.moveCenterPoint(335, true);
	}

	public hoverOnSlider(index: number) {
		if (!this.selectedPoint) {
			this.hoveredElementIndex = index;
		}
	}
	public hoverOffSlider() {
		if (!this.selectedPoint) {
			this.hoveredElementIndex = -1;
		}
	}
	protected readonly InputTextSize = InputTextSize;
	protected readonly ButtonSize = ButtonSize;
	protected readonly Math = Math;
}
