import { Component, OnInit, inject } from '@angular/core';
import { TenderService } from '../../api/tender.service';
import { ActivatedRoute } from '@angular/router';
import { tenderDetail } from '../../models/tender.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { PageTitleService } from '../../services/page-title.service';


interface ProcessedInfo {
  title: string;
  paragraphs: string[];
}

@Component({
  selector: 'app-tender-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tender-details.component.html',
  styleUrl: './tender-details.component.scss',
})
export class TenderDetailsComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  private route = inject(ActivatedRoute);
  private tenderService = inject(TenderService);

  private pageTitleService = inject(PageTitleService);

  cardId = 0;
  tenderDetailData: tenderDetail = {};

  processedTenderInfo: ProcessedInfo[] = [];

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId = +idParam;
      this.loadTenderDetails(this.cardId); 
    } else {
      console.error('ID is missing in the route parameters.');
    }
  }

  loadTenderDetails(id: number): void {
    this.tenderService.getTenderDetailData(id).subscribe(
      (response) => {
        this.tenderDetailData = response.data.tender;

        if (this.tenderDetailData && this.tenderDetailData.name) {
          this.pageTitleService.setCustomTitle(this.tenderDetailData.name);
        }

        if (response && response.data.tender.information) {
          this.processedTenderInfo = response.data.tender.information.map((item) => {
            const description: string = item.description || '';
            const paragraphs: string[] = [];

            if (description.includes('-')) {
              const parts = description.split('-');
              if (parts[0] && parts[0].trim() !== '') {
                paragraphs.push(parts[0].trim());
              }
              for (let i = 1; i < parts.length; i++) {
                if (parts[i].trim() !== '') {
                  paragraphs.push('- ' + parts[i].trim());
                }
              }
            } else {
              paragraphs.push(description);
            }

            return {
              title: item.title,
              paragraphs: paragraphs,
            };
          });
        }
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
}
