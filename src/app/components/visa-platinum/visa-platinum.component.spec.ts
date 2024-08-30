import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaPlatinumComponent } from './visa-platinum.component';

describe('VisaPlatinumComponent', () => {
  let component: VisaPlatinumComponent;
  let fixture: ComponentFixture<VisaPlatinumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisaPlatinumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisaPlatinumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
