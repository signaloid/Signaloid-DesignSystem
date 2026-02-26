import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";

@Component({
	selector: 'lib-infromation-tooltip',
	imports: [NgClass, NgIf],
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
