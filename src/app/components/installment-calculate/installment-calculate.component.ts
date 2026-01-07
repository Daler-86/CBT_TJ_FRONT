import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, PercentPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstallmentResult } from '../../models/calculate.model';
import { InstallmentService } from '../../services/installment.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-installment-calculate',
  standalone: true,
  imports: [CommonModule, FormsModule, PercentPipe, DecimalPipe, TranslateModule],
  templateUrl: './installment-calculate.component.html',
  styleUrl: './installment-calculate.component.scss',
})
export class InstallmentCalculateComponent implements OnInit {
  private installmentService = inject(InstallmentService);
  
  @ViewChild('amountInput') amountInput?: ElementRef<HTMLInputElement>;

  minAmount = 0;
  maxAmount = 0;
  availableTerms: number[] = [];

  loanAmount = 10000;
  loanTerm = 12;
  loanAmountPercent = '0%';
  
  isEditingAmount = false;
  isAmountInvalid = false; 

  calculationResult: InstallmentResult | null = null;

  ngOnInit(): void {
    const conditions = this.installmentService.getConditions();
    this.minAmount = conditions.minAmount;
    this.maxAmount = conditions.maxAmount;
    this.availableTerms = this.installmentService.getAvailableTerms();

    if (!this.availableTerms.includes(this.loanTerm)) {
      this.loanTerm = this.availableTerms.length > 0 ? this.availableTerms[0] : 12;
    }

    this.recalculate();
  }

  handleFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.select();
  }

  recalculate(event?: Event): void {

    if (event && event.target) {
      const target = event.target as HTMLInputElement;
      let rawValue = target.value;

      if (rawValue === '' || rawValue === null) {
        this.loanAmount = 0;
        target.value = '0';
      } else {
        const numValue = Math.abs(Number(rawValue));
        this.loanAmount = numValue;
        target.value = numValue.toString();
      }
    } else {
      this.loanAmount = Math.abs(Number(this.loanAmount || 0));
    }

    this.isAmountInvalid = this.loanAmount < this.minAmount || this.loanAmount > this.maxAmount;

    this.calculationResult = this.installmentService.calculate({
      amount: this.loanAmount,
      term: this.loanTerm,
    });

    this.updateVisuals();
  }

  updateVisuals(): void {
    const calcPct = (v: number, min: number, max: number) => {
      if (max <= min) return '0%';
      const p = ((v - min) / (max - min)) * 100;
      return `${Math.max(0, Math.min(100, p))}%`;
    };
    this.loanAmountPercent = calcPct(this.loanAmount, this.minAmount, this.maxAmount);
  }

  startEditing(): void {
    this.isEditingAmount = true;
    setTimeout(() => this.amountInput?.nativeElement.focus(), 0);
  }

  stopEditing(): void {
    this.isEditingAmount = false;
    this.recalculate(); 
  }
}