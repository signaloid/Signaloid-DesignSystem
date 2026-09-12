import { Component, Input } from '@angular/core';

@Component({
	selector: 'lib-circular-progress',
	templateUrl: './circular-progress.component.html',
	styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent {
	@Input() current: number = 6; // in millions
	@Input() total: number = 10000; // in gigabytes

	get progressPercent(): number {
		return (this.current / this.total) * 100;
	}
}
