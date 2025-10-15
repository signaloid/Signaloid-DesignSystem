import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionPlotContainerComponent } from './distribution-plot-container.component';

describe('DistributionPlotContainerComponent', () => {
  let component: DistributionPlotContainerComponent;
  let fixture: ComponentFixture<DistributionPlotContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributionPlotContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributionPlotContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
