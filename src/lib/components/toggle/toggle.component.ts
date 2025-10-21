import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputSwitch } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'lib-toggle',
	imports: [InputSwitch, FormsModule],
	templateUrl: './toggle.component.html',
	styleUrl: './toggle.component.css',
})
export class ToggleComponent {
	@Input() isChecked: boolean = false;
  @Input() disabled: boolean = false;
	@Output() toggleChange = new EventEmitter<boolean>();
	onToggleChange(event: any) {
		this.toggleChange.emit(event.checked);
	}
}
