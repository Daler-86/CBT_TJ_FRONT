import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CreditService } from '../../api/credit.service';
import { creditList } from '../../models/credit.model';
import { MenuService } from '../../api/menu.service';
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-credit-overview',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, NgFor],
  templateUrl: './credit-overview.component.html',
  styleUrl: './credit-overview.component.scss'
})
export class CreditOverviewComponent {
  imageUrl: string = environment.IMAGE_URL;
  selectedTab: string = 'all';
  credits:creditList[]=[]
personTypeId:number=1

  selectTab(tab: string) {
    this.selectedTab = tab;

  }

  ngOnInit(): void {
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadCreditList(this.personTypeId);
    });

  }
constructor(  private creditService: CreditService, private menuService: MenuService){}
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

}
