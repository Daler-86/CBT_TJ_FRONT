import { CommonModule } from '@angular/common';
import { Component,  inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../api/news.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private translate = inject(TranslateService);
  private pageTitleService = inject(PageTitleService);

  copyButtonText = '';
  cardId = 0;
  newDetailData: any = null; 

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.translate.get('BUTTONS.COPY_LINK').subscribe((text: string) => {
      this.copyButtonText = text;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cardId = +idParam;
      this.loadNewsDetail(this.cardId);
    }
  }

  loadNewsDetail(id: number): void {
    this.newsService.getNewsDetailData(id).subscribe({
      next: (response) => {
        this.newDetailData = response.data.news;
        if (this.newDetailData?.title) {
          this.pageTitleService.setCustomTitle(this.newDetailData.title);
        }
      },
      error: (error) => console.error('Ошибка при запросе данных', error),
    });
  }

  onCopyLink() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      this.translate.get('BUTTONS.LINK_COPIED').subscribe((text: string) => {
        this.copyButtonText = text;
      });

      setTimeout(() => {
        this.translate.get('BUTTONS.COPY_LINK').subscribe((text: string) => {
          this.copyButtonText = text;
        });
      }, 2000);
    });
  }

  get telegramShareLink(): string {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.newDetailData?.title || '');
    return `https://t.me/share/url?url=${url}&text=${text}`;
  }

  get whatsappShareLink(): string {
    const url = window.location.href;
    const text = encodeURIComponent(this.newDetailData?.title || '');
    return `https://wa.me/?text=${text}: ${url}`;
  }
}
