import { Component, forwardRef } from '@angular/core';
import { InputOtp } from 'primeng/inputotp';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'lib-input-otp',
	imports: [InputOtp, FormsModule],
	templateUrl: './input-otp.component.html',
	styleUrl: './input-otp.component.css',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputOtpComponent),
			multi: true,
		},
	],
})
export class InputOtpComponent implements ControlValueAccessor {
	protected onChange: (value: any) => void = () => { };
	private onTouched: () => void = () => { };
	disabled = false;
	writeValue(obj: number): void {
		this.value = obj
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
	protected value: number | undefined;
}
