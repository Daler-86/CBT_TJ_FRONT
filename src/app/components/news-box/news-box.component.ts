import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsEventItem, news } from '../../models/news.model';

import { Router, RouterLink, RouterModule } from '@angular/router';

import { NewsService } from '../../api/news.service';
import { environment } from '../../../environments/environment';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-news-box',
  standalone: true,
  imports: [RouterModule, RouterLink,TranslateModule ],
  templateUrl: './news-box.component.html',
  styleUrl: './news-box.component.scss',
})
export class NewsBoxComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL; // Если у вас есть изображения для новостей
  newsItems: NewsEventItem[] = []; // Этот массив, возможно, не используется, можно удалить
  private router = inject(Router);
  private newsService = inject(NewsService);

  // trackById обычно используется для *ngFor для повышения производительности
  trackById(index: number, item: fullNews): number {
    // Изменен тип item на fullNews
    return item.id;
  }

  // Если этот метод не используется, его можно удалить.
  // navigateToCardDetailsAndForm(cardId: number): void {
  //   this.router.navigate(['/news-detail', cardId], { queryParams: { scrollToForm: true } });
  // }

  news: fullNews[] = []; // Массив для хранения обработанных новостей

  ngOnInit(): void {
    this.loadData();
  }

  // Эти инпуты и аутпуты, кажется, относятся к пагинации,
  // но для блока последних 3-х новостей они не нужны.
  // Если это отдельный компонент для списка новостей с пагинацией, то оставьте.
  // Если это только для "последних новостей", то можно удалить.
  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  tenderCount = 0;

  loadData(): void {
    // Запрашиваем 3 новости с первой страницы.
    // Убедитесь, что ваш getNewsList принимает count и page.
    this.newsService.getNewsList(3, 1).subscribe({
      next: (response) => {
        // Проверяем, что news существует и это массив
        if (response.data && Array.isArray(response.data.news)) {
          // Если новости не приходят отсортированными по дате, отсортируйте их здесь
          // const sortedNews = [...response.data.news].sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
          // const latestThreeNews = sortedNews.slice(0, 3); // Возьмем только 3, если запрос вернул больше

          const processedNews = response.data.news.map((item) => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.description || ''; // Убедитесь, что item.description существует
            const extractedText = (tempDiv.textContent || '').trim();

            let shortDescription = extractedText;
            if (extractedText.length > 90) {
              // Ограничение длины описания
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
