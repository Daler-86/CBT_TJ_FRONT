import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NewsEventItem, fullNews } from '../../models/news.model';

import { Router, RouterLink, RouterModule } from '@angular/router';

import { NewsService } from '../../api/news.service';
import { environment } from '../../../environments/environment';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-news-box',
  standalone: true,
  imports: [RouterModule, RouterLink, TranslateModule],
  templateUrl: './news-box.component.html',
  styleUrl: './news-box.component.scss',
})
export class NewsBoxComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL; 
  newsItems: NewsEventItem[] = [];
  private router = inject(Router);
  private newsService = inject(NewsService);


  trackById(index: number, item: fullNews): number {
    return item.id;
  }


  news: fullNews[] = []; 

  ngOnInit(): void {
    this.loadData();
  }


  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  tenderCount = 0;

  loadData(): void {

    this.newsService.getNewsList(3, 1).subscribe({
      next: (response) => {
    
        if (response.data && Array.isArray(response.data.news)) {
    
          const processedNews = response.data.news.map((item) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.description || ''; 
            const extractedText = (tempDiv.textContent || '').trim();

            let shortDescription = extractedText;
            if (extractedText.length > 90) {
    
              shortDescription = extractedText.substring(0, 90) + '...';
            }
            return {
              ...item,
              shortDescription: shortDescription, // Добавляем shortDescription к объекту новости
            };
          });

          this.news = processedNews; // Сохраняем обработанные 3 новости
        } else {
          console.warn('API response for news is not in expected format:', response);
          this.news = [];
        }
      },
      error: (error) => {
        console.error('Ошибка при загрузке новостей', error);
        this.news = []; // Очищаем новости в случае ошибки
      },
    });
  }
}
