import { Component } from '@angular/core';

@Component({
  selector: 'lib-infromation-tooltip',
  imports: [],
  templateUrl: './infromation-tooltip.component.html',
  styleUrl: './infromation-tooltip.component.css'
})
export class InfromationTooltipComponent {
  protected showingTooltip = false;
  showTooltip() {
    this.showingTooltip = true;
  }
  hideTooltip() {
    this.showingTooltip = false;
  }
}
