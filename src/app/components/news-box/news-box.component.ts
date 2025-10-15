import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsEventItem, news } from '../../models/news.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { NewsService } from '../../api/news.service';
import {environment} from "../../../environments/environment";
import { new_news } from '../news/news.component';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-news-box',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, TranslateModule ],
  templateUrl: './news-box.component.html',
  styleUrl: './news-box.component.scss'
})
export class NewsBoxComponent {
  imageUrl: string = environment.IMAGE_URL;
  newsItems: NewsEventItem[] = [];
  constructor( private router:Router, private newsService:NewsService){}

  trackById(index: number, item: NewsEventItem): number {
    return item.id;
  }
  navigateToCardDetailsAndForm(cardId: number): void {
    this.router.navigate(['/news-detail', cardId], { queryParams: { scrollToForm: true } });
  }

  news:any[]=[]
  ngOnInit(): void {
    // Здесь позже будет логика получения данных с бэкенда
    // console.log('Tender list initialized with mock data.');
    this.loadData()
  }

  @Input () totalPages: number = 0; // Общее количество страниц
  @Input() currentPage: number = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  tenderCount:number=0
  loadData(): void {
    // Ваш запрос к серверу остается без изменений
    this.newsService.getNewsList(5, 1).subscribe(
      (response) => {
        
        const processedNews = response.data.news.map(item => {
          
          // --- Единственное, что мы делаем — укорачиваем текст ---
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.description || '';
          const extractedText = (tempDiv.textContent || '').trim();
  
          let shortDescription = extractedText;
          if (extractedText.length > 90) {
            shortDescription = extractedText.substring(0, 90) + '...';
          }
          // --- Возвращаем объект, добавляя только короткое описание ---
          return {
            ...item,
            shortDescription: shortDescription
          };
        });
  
        this.news = processedNews;
  

      },
      (error) => {
        console.error('Ошибка при загрузке новостей', error);
      }
    );
  }
}
