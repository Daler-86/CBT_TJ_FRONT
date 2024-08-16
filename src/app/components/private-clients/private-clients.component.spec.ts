import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateClientsComponent } from './private-clients.component';

describe('PrivateClientsComponent', () => {
  let component: PrivateClientsComponent;
  let fixture: ComponentFixture<PrivateClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
