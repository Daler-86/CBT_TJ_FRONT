import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceInfoComponent } from './insurance-info.component';

describe('InsuranceInfoComponent', () => {
  let component: InsuranceInfoComponent;
  let fixture: ComponentFixture<InsuranceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsuranceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
