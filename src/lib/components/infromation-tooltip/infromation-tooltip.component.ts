import { Component, Input } from '@angular/core';

@Component({
	selector: 'lib-infromation-tooltip',
	standalone: true,
	templateUrl: './infromation-tooltip.component.html',
	styleUrl: './infromation-tooltip.component.css'
})
export class InfromationTooltipComponent {
	@Input() position: 'top' | 'bottom' | 'left' | 'right' = 'right';
	protected showingTooltip = false;
	showTooltip() {
		this.showingTooltip = true;
	}
	hideTooltip() {
		this.showingTooltip = false;
	}
}
