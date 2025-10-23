import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../api/news.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageTitleService } from '../../services/page-title.service';
import { news } from '../../models/news.model';
interface SocialLink {
  type: string;
  url: string;
  ariaLabel: string;
  iconClass: string;
}
@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent implements OnInit {
  // --- Данные для статьи (замени на реальные) ---
  copyButtonText = '';
  imageUrls: string[] = [
    'assets/images/news-detail-1.jpg',
    'assets/images/news-detail-2.jpg',
    'assets/images/news-detail-3.jpg',
  ];
  private pageTitleService = inject(PageTitleService);
  // --- Данные для блока "Поделиться" ---
  socialLinks: SocialLink[] = [];
  pageUrl = '';
  //  copyButtonText: string = 'Скопировать ссылку';
  @Inject(DOCUMENT)
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private translate = inject(TranslateService);
  constructor() {
    this.translate.get('buttons.copyLink').subscribe((text: string) => {
      this.copyButtonText = text;
    });
  } // Внедряем DOCUMENT

  cardId = 0;
  newDetailData: news = {
    id: 0,
  };

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
    this.newsService.getNewsDetailData(id).subscribe(
      (response) => {
        this.newDetailData = response.data.news;
        if (this.newDetailData && this.newDetailData.title) {
          this.pageTitleService.setCustomTitle(this.newDetailData.title);
        }
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }

  onCopyLink() {
    // Ваша логика копирования ссылки...
    // navigator.clipboard.writeText(window.location.href);

    // После успешного копирования меняем текст
    this.translate.get('buttons.linkCopied').subscribe((text: string) => {
      this.copyButtonText = text;
    });

    // Опционально: вернуть исходный текст через пару секунд
    setTimeout(() => {
      this.translate.get('buttons.copyLink').subscribe((text: string) => {
        this.copyButtonText = text;
      });
    }, 2000);
  }

  // TrackBy функции для оптимизации
  trackByIndex(index: number): number {
    return index;
  }

  trackBySocialType(index: number, item: SocialLink): string {
    return item.type;
  }
}
