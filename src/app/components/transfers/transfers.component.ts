import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransfersService } from '../../api/transfer.service';
import { MenuService } from '../../api/menu.service';
import { Transfer } from '../../models/transfers.model';
@Component({
  selector: 'app-transfers',
  standalone: true,
  imports:[RouterLink, RouterModule, TranslateModule, NgIf, NgFor,CommonModule],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.scss'
})
export class TransfersComponent {
  personTypeId: number = 1;
  constructor(private transfersService: TransfersService, private menuService: MenuService, private router: Router) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadAllTransfers(); // Загрузка всех карт по умолчанию
    });
  }
transfersList:Transfer[]=[]
  loadAllTransfers() {
    
    this.transfersService.getTransfersListAll().subscribe(
      (response) => {
        this.transfersList = response.data.transfers;
        
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
    );
  }

  onCardClick(cardId: number) {
    // this.c.getCardContentItem(cardId).subscribe(
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
