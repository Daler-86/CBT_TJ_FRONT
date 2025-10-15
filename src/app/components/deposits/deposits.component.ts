import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {DepositsService} from '../../api/deposit.service';
import {MenuService} from '../../api/menu.service';
import {Deposit} from '../../models/deposit.model';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, CommonModule],
  templateUrl: './deposits.component.html',
  styleUrl: './deposits.component.scss'
})
export class DepositsComponent {
  imageUrl: string = environment.IMAGE_URL;
  personTypeId: number = 1;

  constructor(private depositService: DepositsService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadAllTransfers(); // Загрузка всех карт по умолчанию
    });
  }

  depositsList: Deposit[] = []

  loadAllTransfers() {

    this.depositService.getDepositsListAll().subscribe(
      (response) => {
        this.depositsList = response.data.deposits;

      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
    );
  }
}
