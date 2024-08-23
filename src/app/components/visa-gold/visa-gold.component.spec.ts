import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaGoldComponent } from './visa-gold.component';

describe('VisaGoldComponent', () => {
  let component: VisaGoldComponent;
  let fixture: ComponentFixture<VisaGoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisaGoldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisaGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
