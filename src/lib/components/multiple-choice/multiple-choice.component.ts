import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'lib-multiple-choice',
  imports: [MatRadioGroup, MatRadioButton],
  templateUrl: './multiple-choice.component.html',
  standalone: true,
  styleUrl: './multiple-choice.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleChoiceComponent),
      multi: true
    }
  ]
})
export class MultipleChoiceComponent implements ControlValueAccessor, OnInit {
  @Input() options: { name: string, value: string }[] | undefined = [];
  @Input() defaultValue: string | undefined;
  @Input() disabled = false;
  @Output() valueUpdate = new EventEmitter<string>();
  value: string | undefined;
  ngOnInit() {
    this.value = this.defaultValue;
  }

  onChange: (value: string) => void = (value: string) => {
    this.valueUpdate.emit(value);
  };

  onTouched: () => void = () => {
  };

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    this.value = value;
  }
}
