import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentCalculateComponent } from './installment-calculate.component';

describe('InstallmentCalculateComponent', () => {
  let component: InstallmentCalculateComponent;
  let fixture: ComponentFixture<InstallmentCalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallmentCalculateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstallmentCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
