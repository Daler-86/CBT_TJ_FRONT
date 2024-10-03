import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavriComponent } from './favri.component';

describe('FavriComponent', () => {
  let component: FavriComponent;
  let fixture: ComponentFixture<FavriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavriComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
