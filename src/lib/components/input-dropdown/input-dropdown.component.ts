import { Component, ElementRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormField, MatHint, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
	selector: 'lib-input-dropdown',
	imports: [MatFormField, MatSelect, MatOption, MatLabel, MatHint],
	templateUrl: './input-dropdown.component.html',
	styleUrl: './input-dropdown.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: InputDropdownComponent,
			multi: true,
		},
	],
})
export class InputDropdownComponent implements ControlValueAccessor {
	@Input() label: string = 'Field Label';
	@Input() placeholder: string = 'Placeholder text';
	@Input() options: string[] | number[] = [];
  @Input() hint: string | null = null;
	constructor(private elementRef: ElementRef) {}
	isOpen = false;
	value: string | number | null = null;

	onChange = (val: any) => {};
	onTouched = () => {};

	toggleDropdown() {
		this.isOpen = !this.isOpen;
	}

	selectOption(option: string | number) {
		this.isOpen = false;
		this.value = option;
		this.onChange(option);
	}

	writeValue(obj: any): void {
		this.value = obj;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	updateValue(value: string) {
		this.value = value;
		this.onChange(value);
	}
}
