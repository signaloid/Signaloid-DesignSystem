import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarbonIconComponent } from './icon.component';
// @ts-ignore
import Add16 from '@carbon/icons/es/watson-health/3D-curve--auto-vessels/20';

describe('CarbonIconComponent', () => {
	let fixture: ComponentFixture<CarbonIconComponent>;
	let component: CarbonIconComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CarbonIconComponent],
			// or "declarations: [CarbonIconComponent]" if NOT standalone
		}).compileComponents();
	});

	it('should throw an error if icon property is missing', () => {
		// We do NOT call `fixture.detectChanges()` in beforeEach,
		// because we want to wrap that call in an expect().
		expect(() => {
			// Create the component but DO NOT assign an icon
			fixture = TestBed.createComponent(CarbonIconComponent);
			component = fixture.componentInstance;

			// This triggers ngOnInit(), which throws:
			fixture.detectChanges();
		}).toThrowError('Icon is required');
	});

	it('should NOT throw an error if icon property is provided', () => {
		expect(() => {
			fixture = TestBed.createComponent(CarbonIconComponent);
			component = fixture.componentInstance;

			// Provide a valid icon before triggering ngOnInit()
			component.icon = Add16;

			// Now ngOnInit() should NOT throw
			fixture.detectChanges();
		}).not.toThrow();
	});
});
