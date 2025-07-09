import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositCalculateComponent } from './deposit-calculate.component';

describe('DepositCalculateComponent', () => {
  let component: DepositCalculateComponent;
  let fixture: ComponentFixture<DepositCalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositCalculateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepositCalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
