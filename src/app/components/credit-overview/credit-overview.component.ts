import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CreditBarakatComponent } from '../credit-barakat/credit-barakat.component';
import { AutocreditComponent } from '../autocredit/autocredit.component';
import { CreditService } from '../../api/credit.service';
import { creditList } from '../../models/credit.model';
@Component({
  selector: 'app-credit-overview',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor, CreditBarakatComponent,AutocreditComponent],
  templateUrl: './credit-overview.component.html',
  styleUrl: './credit-overview.component.scss'
})
export class CreditOverviewComponent {
  selectedTab: string = 'all';
  credits:creditList[]=[]


  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }
  
  ngOnInit(): void {
    this.loadCreditList(1)
  }
constructor(  private creditService: CreditService,){}
  loadCreditList(id: number): void {
    this.creditService.getCreditList(id).subscribe(
      (details) => { 
        this.credits=details.data.credits
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }
  onCreditClick(credit:creditList ) {
    // this.cardsService.getCardContentItem(cardId).subscribe(
    //   (details) => {
    //     this.contentItem = details.data.card_content_items;
    //     console.log(details);
    //   },
    //   (error) => {
    //     console.error('Ошибка при получении деталей карты', error);
    //   }
    // );
  }
}
