// src/app/services/resolvers/news-title.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

// !!! ЗАМЕНИТЕ НА ВАШ СЕРВИС ДЛЯ НОВОСТЕЙ !!!
import { NewsService } from '../../api/news.service';

export const newsTitleResolver: ResolveFn<string> = (route) => {
  const newsService = inject(NewsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Новость'; // Запасное название
  }

  // !!! ЗАМЕНИТЕ НА ВАШ МЕТОД ПОЛУЧЕНИЯ ДАННЫХ !!!
  return newsService.getNewsDetailData(+id).pipe(
    // !!! ЗАМЕНИТЕ НА ПРАВИЛЬНЫЙ ПУТЬ К ЗАГОЛОВКУ В ОТВЕТЕ API !!!
    map((response) => response.data.news.title || 'Новость'),
  );
};
