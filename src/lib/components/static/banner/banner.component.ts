import { Component, Input } from '@angular/core';
import { ButtonType } from '../../button/button.types';
import { ButtonComponent } from '../../button/button.component';

@Component({
	selector: 'lib-banner',
	imports: [ButtonComponent],
	standalone: true,
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.css',
})
export class BannerComponent {
	@Input() buttonLabel: string = '';
	@Input() disabled = false;
	@Input() hideButton: boolean = false;
	protected readonly ButtonType = ButtonType;
}
