import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlider, MatSliderRangeThumb, MatSliderThumb } from '@angular/material/slider';
import { SliderTypes } from './slider.types';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
	selector: 'lib-slider',
	standalone: true,
	imports: [MatSlider, MatSliderThumb, MatSliderRangeThumb, FormsModule, NgIf, NgClass],
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SliderComponent),
			multi: true,
		},
	],
})
export class SliderComponent implements OnInit, ControlValueAccessor {
	@Input() value = 0;
	@Input() min = 0;
	@Input() max = 100;
	@Input() step = 1;
	@Input() multiple = false;
	@Input() disabled = false;
	@Input() multipleMinValue = 0;
	@Input() multipleMaxValue = 50;
	@Input() type: SliderTypes = SliderTypes.NUMERIC;
	@Input() labelBelow: string | undefined;
  @Input() alwaysShowValue = false;
  @Input() hasBigNumbers = true;
	// Use these `EventEmitter`s if you need separate outputs
	@Output() valueChange = new EventEmitter<number>();
	@Output() rangeChange = new EventEmitter<{ min: number; max: number }>();
	@Output() valueUpdate = new EventEmitter<number>();
	protected readonly SliderTypes = SliderTypes;

	/**
	 * ControlValueAccessor callbacks
	 */
	private onChangeFn: (value: any) => void = () => {};
	private onTouchedFn: () => void = () => {};

	ngOnInit(): void {}

	// -------------------------------------------------------
	// ControlValueAccessor methods
	// -------------------------------------------------------

	/**
	 * Called by Angular forms to set a new value on your component.
	 */
	writeValue(obj: any): void {
		if (this.multiple) {
			// Expect an object or array with `min` and `max`
			if (obj && typeof obj === 'object') {
				this.multipleMinValue = obj.min ?? this.multipleMinValue;
				this.multipleMaxValue = obj.max ?? this.multipleMaxValue;
			}
		} else {
			// Single value
			this.value = obj ?? 0;
		}
	}

	/**
	 * Register a callback to notify Angular forms that the value has changed.
	 */
	registerOnChange(fn: (value: any) => void): void {
		this.onChangeFn = fn;
	}

	/**
	 * Register a callback to notify Angular forms that the component has been touched.
	 */
	registerOnTouched(fn: () => void): void {
		this.onTouchedFn = fn;
	}

	/**
	 * When form disables or enables this component
	 */
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	// -------------------------------------------------------
	// Internal event handlers
	// -------------------------------------------------------

	onValueChange(newValue: number) {
		this.value = newValue;
		// Notify Angular forms that the value changed
		this.onChangeFn(newValue);
		// Also emit your original EventEmitter for template-driven usage, if needed
		this.valueChange.emit(newValue);
	}

	onUpdate(newValue: number) {
		this.valueUpdate.emit(newValue);
	}

	onRangeChange(minVal: number, maxVal: number) {
		this.multipleMinValue = minVal;
		this.multipleMaxValue = maxVal;
		// Notify Angular forms with an object
		const rangeObj = { min: minVal, max: maxVal };
		this.onChangeFn(rangeObj);
		this.rangeChange.emit(rangeObj);
	}

	// For blur / touch events
	onBlur() {
		this.onTouchedFn();
	}

  formatLabel(value: number ): string {
    let valueNumber = Number(value);
    if (valueNumber === null || valueNumber === undefined || isNaN(valueNumber)) {
      return `${valueNumber}`;
    }

    if (Math.abs(valueNumber) < 1000) {
      return `${ valueNumber }`;
    }

    const units = ['k', 'M', 'B', 'T'];
    let unitIndex = -1;

    while (Math.abs(valueNumber) >= 1000 && unitIndex < units.length - 1) {
      valueNumber = valueNumber / 1000;
      unitIndex++;
    }

    return `${parseFloat(valueNumber.toFixed(1))}${units[unitIndex]}`;
  }
}
