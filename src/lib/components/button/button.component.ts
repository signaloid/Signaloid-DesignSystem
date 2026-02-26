import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CarbonIconComponent } from '../icon/icon.component';
// @ts-ignore
import Add16 from '@carbon/icons/es/watson-health/3D-curve--auto-vessels/20';
import { ButtonSize, ButtonSizes, ButtonType } from './button.types';
import { SafeHtmlPipe } from 'primeng/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'lib-button',
	imports: [MatButton, CarbonIconComponent, SafeHtmlPipe, MatProgressSpinner],
	standalone: true,
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
	@Input() size: ButtonSize = ButtonSize.M;
	@Input() leftIcon: any;
	@Input() rightIcon: any;
	@Input() disabled = false;
	@Input() label: string = '';
	@Input() type: ButtonType = ButtonType.Primary;
	@Input() loading = false;
	@Input() leftSvgIcon?: string;
	@Output() onClick = new EventEmitter();
	protected buttonSize = ButtonSizes[this.size];
	protected readonly Add16 = Add16;

	ngOnInit() {
		if (!this.buttonSize) {
			throw new Error(`Invalid button size: ${this.size}`);
		}

		this.buttonSize = ButtonSizes[this.size];
		if (!this.buttonSize) {
			throw new Error(`Invalid button size: ${this.size}`);
		}
	}

	protected readonly ButtonType = ButtonType;
	protected readonly ButtonSize = ButtonSize;
}
