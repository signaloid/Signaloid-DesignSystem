import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'lib-footer',
	imports: [MatDividerModule],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.css',
})
export class FooterComponent {}
