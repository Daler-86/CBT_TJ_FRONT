import { Component, EventEmitter, Input, Output, OnInit, OnChanges, inject } from '@angular/core';
import { NewsEventItem } from '../../models/news.model';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { NewsService } from '../../api/news.service';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

export interface new_news {
  id: number;
  title?: string;
  description: string; // Исходная HTML строка
  date_time: string;
  upload_file: string;
  firstParagraphText?: string; // <--- Это поле мы добавляем ЛОКАЛЬНО для удобства шаблона
}
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit, OnChanges {
  imageUrl: string = environment.IMAGE_URL;
  newsItems: NewsEventItem[] = [];
  private router = inject(Router);
  private newsService = inject(NewsService);

  trackById(index: number, item: NewsEventItem): number {
    return item.id;
  }
  navigateToCardDetailsAndForm(cardId: number): void {
    this.router.navigate(['/news', cardId], { queryParams: { scrollToForm: true } });
  }

  news: new_news[] = [];
  ngOnInit(): void {
    // Здесь позже будет логика получения данных с бэкенда
    this.loadData();
  }

  @Input() totalPages = 0; // Общее количество страниц
  @Input() currentPage = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  tenderCount = 0;
  loadData(): void {
    this.newsService.getNewsList(2, this.currentPage).subscribe(
      (response) => {
        // *** Вот здесь происходит обработка и создание НОВОГО массива ***
        const processedNews = response.data.news.map((item) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.description || '';
          const firstParagraph = tempDiv.querySelector('p');
          const extractedText = firstParagraph ? firstParagraph.textContent : tempDiv.textContent;

          // Возвращаем НОВЫЙ объект, который включает все свойства исходного 'item'
          // плюс наше новое локальное свойство 'firstParagraphText'
          return {
            ...item, // Копирует id, title, description, date_time, upload_file из исходного item
            firstParagraphText: extractedText, // Добавляет новое свойство в этот НОВЫЙ объект
          } as new_news; // Приводим к типу news (с учетом опционального поля)
        });

        // Присваиваем этот НОВЫЙ массив свойству 'news' компонента
        this.news = processedNews;

        this.totalPages = Math.ceil(response.data.total_count / 2);
        this.tenderCount = response.data.total_count;

        this.updatePages();
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      },
    );
  }
  ngOnChanges() {
    this.updatePages();
  }

  updatePages() {
    this.pages = [];
    const visiblePages = 3; // Количество видимых страниц до/после текущей
    const rangeStart = Math.max(1, this.currentPage - 1);
    const rangeEnd = Math.min(this.totalPages, this.currentPage + visiblePages - 1);

    // Добавляем страницы перед ...
    if (rangeStart > 2) {
      this.pages.push(1);
      if (rangeStart > 3) {
        this.pages.push(-1); // Индикатор для ...
      }
    }

    // Добавляем текущие видимые страницы
    for (let i = rangeStart; i <= rangeEnd; i++) {
      this.pages.push(i);
    }

    // Добавляем страницы после ...
    if (rangeEnd < this.totalPages - 1) {
      if (rangeEnd < this.totalPages - 2) {
        this.pages.push(-1); // Индикатор для ...
      }
      this.pages.push(this.totalPages);
    }
  }
  selectPage(page: number) {
    if (page === -1) return; // Игнорируем "..."
    this.currentPage = page;
    this.updatePages();
    this.pageChange.emit(this.currentPage);
    this.scrollToTop();
    this.loadData();
  }
  scrollToTop(): void {
    const listElement = document.querySelector('.list-container'); // Замените '.list-container' на ваш селектор списка
    if (listElement) {
      listElement.scrollTo({
        top: 0,
        behavior: 'smooth', // Плавная прокрутка
      });
    } else {
      // Если контейнер не найден, прокручиваем всю страницу
      window.scrollTo({
        top: 1,
        behavior: 'smooth', // Плавная прокрутка
      });
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.selectPage(this.currentPage + 1);
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.selectPage(this.currentPage - 1);
      this.scrollToTop();
    }
  }
}
