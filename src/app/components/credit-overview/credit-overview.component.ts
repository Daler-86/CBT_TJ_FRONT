import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CreditBarakatComponent } from '../credit-barakat/credit-barakat.component';
import { AutocreditComponent } from '../autocredit/autocredit.component';


@Component({
  selector: 'app-credit-overview',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor, CreditBarakatComponent,AutocreditComponent],
  templateUrl: './credit-overview.component.html',
  styleUrl: './credit-overview.component.scss'
})
export class CreditOverviewComponent {
  selectedTab: string = 'all';
  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }
}
