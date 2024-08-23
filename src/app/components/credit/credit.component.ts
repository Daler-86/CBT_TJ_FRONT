import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgIf, NgFor],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.scss'
})
export class CreditComponent {
  selectedTab: string = 'all';
  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }

  
}
