import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLoanCalculateComponent } from './car-loan-calculate.component';

describe('CarLoanCalculateComponent', () => {
  let component: CarLoanCalculateComponent;
  let fixture: ComponentFixture<CarLoanCalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLoanCalculateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarLoanCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
