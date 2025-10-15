import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TitleCasePipe } from '@angular/common';
import { CarbonIconComponent } from '../icon/icon.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { groupOptions } from './button-group.types';

@Component({
	selector: 'lib-button-group',
	imports: [MatButtonToggleGroup, MatButtonToggle, TitleCasePipe, CarbonIconComponent, ReactiveFormsModule],
	templateUrl: './button-group.component.html',
	styleUrl: './button-group.component.scss',
	standalone: true,
})
export class ButtonGroupComponent implements OnInit, OnDestroy {
	@Input() optionsArray: groupOptions = [];
	@Input() defaultValue = '';
	@Output() valueChange = new EventEmitter();
  @Input() disabled: boolean = false;
	buttonGroup: FormControl = new FormControl(this.defaultValue);
	privateOptionsArray: groupOptions = [];
	subscriptions: Subscription[] = [];
	ngOnInit() {
		if (this.optionsArray) {
			this.privateOptionsArray = this.optionsArray;
		}
		this.buttonGroup = new FormControl(this.defaultValue);
		const sub = this.buttonGroup.valueChanges.subscribe((value) => {
			this.valueChange.emit(value);
		});
		this.subscriptions.push(sub);
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
}
