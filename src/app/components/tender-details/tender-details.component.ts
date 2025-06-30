import { Component } from '@angular/core';
import { TenderService } from '../../api/tender.service';

import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { tenderDetail } from '../../models/tender.model';
import { CommonModule, NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-tender-details',
  standalone: true,
  imports: [NgFor, CommonModule, TranslateModule],
  templateUrl: './tender-details.component.html',
  styleUrl: './tender-details.component.scss'
})
export class TenderDetailsComponent {

  constructor(
    private route: ActivatedRoute,
    private tenderService: TenderService,
    
  ) { }

  cardId: number=0;
  tenderDetailData:tenderDetail={}

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
    this.tenderService.getTenderDetailData(id).subscribe(
      (response) => {

        this.tenderDetailData = response.data.tender;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
}
