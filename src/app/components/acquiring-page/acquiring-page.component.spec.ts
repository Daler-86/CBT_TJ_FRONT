import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquiringPageComponent } from './acquiring-page.component';

describe('AcquiringPageComponent', () => {
  let component: AcquiringPageComponent;
  let fixture: ComponentFixture<AcquiringPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquiringPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcquiringPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
