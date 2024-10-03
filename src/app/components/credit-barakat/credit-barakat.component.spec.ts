import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBarakatComponent } from './credit-barakat.component';

describe('CreditBarakatComponent', () => {
  let component: CreditBarakatComponent;
  let fixture: ComponentFixture<CreditBarakatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditBarakatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditBarakatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
