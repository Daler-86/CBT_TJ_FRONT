import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { TransfersService } from '../../api/transfer.service';
import { MenuService } from '../../api/menu.service';
import { TransferDetail, transferDetail } from '../../models/transfers.model';

@Component({
  selector: 'app-transfers-details',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './transfers-details.component.html',
  styleUrl: './transfers-details.component.scss'
})
export class TransfersDetailsComponent {

  constructor(
    private route: ActivatedRoute,
    private transferService: TransfersService,
    private elementRef: ElementRef,
    private menuService: MenuService
  ) { }

  cardId: number=0;
  transferData:transferDetail={}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId= +idParam;  // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }
    this.loadCards(this.cardId);
  }

  loadCards(id:number):void {
    this.transferService.getTransferData(id).subscribe(
      (response) => {
    
        this.transferData = response.data.transfer_data;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
}
