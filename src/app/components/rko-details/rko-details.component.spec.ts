import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RkoDetailsComponent } from './rko-details.component';

describe('RkoDetailsComponent', () => {
  let component: RkoDetailsComponent;
  let fixture: ComponentFixture<RkoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RkoDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RkoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
