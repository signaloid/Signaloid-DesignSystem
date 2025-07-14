import { Component, Input } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import {SafeHtmlPipe} from 'primeng/menu';
import { Observable } from 'rxjs';

@Component({
	selector: 'lib-tabs-task-output',
	imports: [MatTabGroup, KeyValuePipe, MatTab, SafeHtmlPipe, AsyncPipe],
	templateUrl: './tabs-task-output.component.html',
	styleUrl: './tabs-task-output.component.scss',
})
export class TabsTaskOutputComponent {
	@Input() outputs!: { [key in 'Stdout' | 'Stderr' | 'Build']: Observable<Object> };
}
