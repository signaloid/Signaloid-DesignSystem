import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { CarbonIconComponent } from '../icon/icon.component';
import { NgControl } from '@angular/forms';
import { InputTextSize, InputTextSizes } from './input-text.models';

@Component({
	selector: 'lib-input-text',
	imports: [CarbonIconComponent],
	templateUrl: './input-text.component.html',
	styleUrl: './input-text.component.css',
	providers: [],
	standalone: true,
})
export class InputTextComponent implements OnInit {
	@Input() label: string = '';
	@Input() placeholder: string = 'Enter text';
	@Input() required: boolean = false;
	@Input() minLength?: number;
	@Input() maxLength?: number;
	@Input() pattern?: string;
	@Input() hint?: string;
	@Input() leftIcon?: any;
	@Input() rightIcon?: any;
	@Input() size: InputTextSize = InputTextSize.M;
	@Input() type: string = 'text';
  @Input() autocomplete: string = 'on';
  @Input() defaultValue: string | undefined;
	@Input() disabled: boolean = false;
	value: string | undefined = '';
	disabledIconColor = 'var(--neutral-b-gray-200)';
	normalColor = 'var(--neutral-b-gray-700)';
	private onChange = (value: string) => { this.valueUpdate.emit(value); };
	private onTouched = () => {};
	protected isFocused = false;
	protected inputSizeValues = InputTextSizes[this.size];
  @Output() focus = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() valueUpdate = new EventEmitter<string>();
	constructor(@Self() @Optional() public ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit() {
    this.value = this.defaultValue;
		this.inputSizeValues = InputTextSizes[this.size];
	}

	writeValue(value: any): void {
		this.value = value || '';
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onInput(event: any): void {
		this.value = event.target.value;
		this.onChange(this.value);
	}

	onFocus() {
		this.isFocused = true;
    this.focus.emit();
	}
	onBlur() {
		this.isFocused = false;
		this.onTouched();
    this.blur.emit();
	}

	get errorMessages(): string[] {
		const errors = this.ngControl?.control?.errors;
		const messages: string[] = [];
		if (errors) {
			if (errors?.['required']) {
				messages.push('This field is required.');
			}
			if (errors?.['minlength']) {
				messages.push(`Minimum length is ${errors['minlength'].requiredLength}.`);
			}
			if (errors?.['maxlength']) {
				messages.push(`Maximum length is ${errors['maxlength'].requiredLength}.`);
			}
			if (errors?.['pattern']) {
				messages.push('Invalid format.');
			}
			if (errors?.['tooFew']) {
				messages.push('Too few values.');
			}
			if (errors?.['tooClose']) {
				messages.push('Sliders will overlap.');
			}
		}
		return messages;
	}
	get hasErrors(): boolean {
		return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
	}

	protected readonly InputTextSizes = InputTextSizes;
	protected readonly InputTextSize = InputTextSize;
}
