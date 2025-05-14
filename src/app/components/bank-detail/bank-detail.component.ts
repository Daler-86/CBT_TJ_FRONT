import { Component, OnInit } from '@angular/core';
import { InfoItem, bankDetails } from '../../models/bank-detail.model';
import { CommonModule } from '@angular/common';
import { BankDetailsService } from '../../api/bank-details.service';

@Component({
  selector: 'app-bank-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-detail.component.html',
  styleUrl: './bank-detail.component.scss'
})
export class BankDetailComponent implements OnInit {
  infoItems: InfoItem[] = [];

  constructor(public bankDetailService:BankDetailsService) { }

  ngOnInit(): void {
    this.loadAllCards();
  }



  trackById(index: number, item: InfoItem): number {
    return item.id;
  }
  bankdetailList:bankDetails[]=[]

   loadAllCards() {
    this.bankDetailService.getBankDetails().subscribe(
      (response) => {
        this.bankdetailList = response.data.bank_details;
        console.log('All cards loaded:', this.bankdetailList);
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
    );
  }



}
