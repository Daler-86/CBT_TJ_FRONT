import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyDigits]',
  standalone: true,
})
export class OnlyDigitsDirective {
  maxDigits = input(15);
  enablePhonePrefix = input(false);

  private readonly PHONE_PREFIX = '+992';

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl,
  ) {}

  @HostListener('focus')
  @HostListener('focus')
  onFocus(): void {
    if (!this.enablePhonePrefix()) return;

    const value = this.control?.control?.value ?? this.el.nativeElement.value;

    if (!value) {
      this.setValue(this.PHONE_PREFIX);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (!this.enablePhonePrefix()) return;

    const value = this.control?.control?.value ?? this.el.nativeElement.value;

    if (value === this.PHONE_PREFIX) {
      this.setValue('');
    }
  }

  @HostListener('input')
  onInput(): void {
    let value = this.el.nativeElement.value;

    value = value.replace(/[^0-9+]/g, '');

    const plusCount = (value.match(/\+/g) || []).length;
    if (plusCount > 1) {
      value = value.replace(/\+/g, '');
      value = '+' + value;
    }

    if (value.includes('+') && value.indexOf('+') !== 0) {
      value = '+' + value.replace(/\+/g, '');
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length > this.maxDigits()) {
      const allowedDigits = digits.slice(0, this.maxDigits());
      let digitIndex = 0;

      value = value.replace(/\d/g, () => allowedDigits[digitIndex++] || '');
    }

    this.el.nativeElement.value = value;
    this.control.control?.setValue(value, { emitEvent: false });
  }

  private setValue(value: string): void {
    this.el.nativeElement.value = value;

    if (this.control?.control) {
      this.control.control.setValue(value, {
        emitEvent: false,
        emitModelToViewChange: false,
        emitViewToModelChange: false,
      });
    }
  }
}
