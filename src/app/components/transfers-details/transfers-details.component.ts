import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { TransfersService } from '../../api/transfer.service';
import { transferDetail } from '../../models/transfers.model';
import { environment } from '../../../environments/environment';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-transfers-details',
  standalone: true,
  imports: [FormsModule, RouterModule, TranslateModule, RouterLink],
  templateUrl: './transfers-details.component.html',
  styleUrl: './transfers-details.component.scss',
})
export class TransfersDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private transferService = inject(TransfersService);

  cardId = 0;
  imageUrl: string = environment.IMAGE_URL;
  transferData: transferDetail = {};
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
    this.loadCards(this.cardId);
  }

  loadCards(id: number): void {
    this.transferService.getTransferData(id).subscribe(
      (response) => {
        this.transferData = response.data.transfer_data;
        if (this.transferData && this.transferData.title) {
          // ...передаем уже готовое, переведенное название в сервис заголовков.
          this.pageTitleService.setCustomTitle(this.transferData.title);
        }
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
}
