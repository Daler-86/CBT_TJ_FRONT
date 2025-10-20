import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { RkoService } from '../../api/rko.service';

import { environment } from '../../../environments/environment';
import { scsDetail } from '../../models/rko.model';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-rko-details',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule],
  templateUrl: './rko-details.component.html',
  styleUrl: './rko-details.component.scss',
})
export class RkoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  private rkoService = inject(RkoService);

  imageUrl: string = environment.IMAGE_URL;
  selectedFaqIndex: number | null = null;
  cardId = 0;
  scsData: scsDetail = {};
  private pageTitleService = inject(PageTitleService);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId = +idParam; // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }

    this.loadRkoDetail(this.cardId);
  }
  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }
  loadRkoDetail(id: number): void {
    this.rkoService.getRkoDetails(id).subscribe(
      (response) => {
        this.scsData = response.data;
        if (this.scsData && this.scsData.title) {
          // ...передаем уже готовое, переведенное название в сервис заголовков.
          this.pageTitleService.setCustomTitle(this.scsData.title);
        }
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
}
