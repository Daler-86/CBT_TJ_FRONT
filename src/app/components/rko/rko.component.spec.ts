import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RkoComponent } from './rko.component';

describe('RkoComponent', () => {
  let component: RkoComponent;
  let fixture: ComponentFixture<RkoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RkoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
