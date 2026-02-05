import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTaskOutputComponent } from './tabs-task-output.component';

describe('TabsTaskOutputComponent', () => {
	let component: TabsTaskOutputComponent;
	let fixture: ComponentFixture<TabsTaskOutputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TabsTaskOutputComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(TabsTaskOutputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
