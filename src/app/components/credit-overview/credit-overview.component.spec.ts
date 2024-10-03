import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditOverviewComponent } from './credit-overview.component';

describe('CreditOverviewComponent', () => {
  let component: CreditOverviewComponent;
  let fixture: ComponentFixture<CreditOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
