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

  recalculate(): void {
     const amount = Number(this.loanAmount) || 0;
    this.isAmountInvalid = amount < this.minAmount || amount > this.maxAmount;
 this.calculationResult = this.installmentService.calculate({
      amount: amount,
      term: this.loanTerm,
    });

      this.updateVisuals();
  }


  updateVisuals(): void {
    if (this.maxAmount <= this.minAmount) {
      this.loanAmountPercent = '0%';
      return;
    }
    const p = ((this.loanAmount - this.minAmount) / (this.maxAmount - this.minAmount)) * 100;
    const safeP = Math.max(0, Math.min(100, p)); 
    this.loanAmountPercent = `${safeP}%`;
  }

  startEditing(): void {
    this.isEditingAmount = true;
    setTimeout(() => {
      this.amountInput?.nativeElement.focus();
      this.amountInput?.nativeElement.select();
    }, 0);
  }

  stopEditing(): void {
    this.isEditingAmount = false;
    if (this.loanAmount < this.minAmount) {
      this.loanAmount = this.minAmount;
    } 

    else if (this.loanAmount > this.maxAmount) {
      this.loanAmount = this.maxAmount;
    }
    this.recalculate();
  }
  setTerm(term: number): void {
    this.loanTerm = term;
    this.recalculate();
  }
}
