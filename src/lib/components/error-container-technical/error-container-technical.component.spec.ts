import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorContainerTechnicalComponent } from './error-container-technical.component';

describe('ErrorContainerTechnicalComponent', () => {
  let component: ErrorContainerTechnicalComponent;
  let fixture: ComponentFixture<ErrorContainerTechnicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorContainerTechnicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorContainerTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
