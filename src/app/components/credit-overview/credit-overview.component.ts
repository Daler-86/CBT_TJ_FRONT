import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CreditService } from '../../api/credit.service';
import { creditList } from '../../models/credit.model';
import { MenuService } from '../../api/menu.service';
import { environment } from '../../../environments/environment';
import { OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-credit-overview',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule],
  templateUrl: './credit-overview.component.html',
  styleUrl: './credit-overview.component.scss',
})
export class CreditOverviewComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  selectedTab = 'all';
  credits: creditList[] = [];
  personTypeId = 1;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.menuService.currentPersonTypeId.subscribe((id) => {
      this.personTypeId = id;
      this.loadCreditList(this.personTypeId);
    });
  }
  private creditService = inject(CreditService);
  private menuService = inject(MenuService);

  loadCreditList(id: number): void {
    this.creditService.getCreditList(id).subscribe(
      (details) => {
        this.credits = details.data.credits;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      },
    );
  }
}
