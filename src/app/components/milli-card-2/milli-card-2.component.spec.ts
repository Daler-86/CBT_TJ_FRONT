import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilliCard2Component } from './milli-card-2.component';

describe('MilliCard2Component', () => {
  let component: MilliCard2Component;
  let fixture: ComponentFixture<MilliCard2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilliCard2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MilliCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
