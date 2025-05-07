import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionSliderComponent } from './distribution-slider.component';

describe('DistributionSliderComponent', () => {
	let component: DistributionSliderComponent;
	let fixture: ComponentFixture<DistributionSliderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DistributionSliderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DistributionSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
