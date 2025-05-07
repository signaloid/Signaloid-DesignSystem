import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalLoaderComponent } from './vertical-loader.component';

describe('VerticalLoaderComponent', () => {
  let component: VerticalLoaderComponent;
  let fixture: ComponentFixture<VerticalLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
