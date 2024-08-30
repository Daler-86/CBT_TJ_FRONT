import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilliCard1Component } from './milli-card-1.component';

describe('MilliCard1Component', () => {
  let component: MilliCard1Component;
  let fixture: ComponentFixture<MilliCard1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilliCard1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MilliCard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
