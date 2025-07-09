import { TestBed } from '@angular/core/testing';

import { CarLoanService } from './car-loan.service';

describe('CarLoanService', () => {
  let service: CarLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
