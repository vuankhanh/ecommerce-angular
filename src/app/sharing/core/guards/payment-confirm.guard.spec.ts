import { TestBed } from '@angular/core/testing';

import { PaymentConfirmGuard } from './payment-confirm.guard';

describe('PaymentConfirmGuard', () => {
  let guard: PaymentConfirmGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PaymentConfirmGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
