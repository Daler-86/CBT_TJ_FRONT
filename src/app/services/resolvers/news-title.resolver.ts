
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs/operators';

import { NewsService } from '../../api/news.service';

export const newsTitleResolver: ResolveFn<string> = (route) => {
  const newsService = inject(NewsService);
  const id = route.paramMap.get('id');

  if (!id) {
    return 'Новость'; 
  }


  return newsService.getNewsDetailData(+id).pipe(
    map((response) => response.data.news.title || 'Новость'),
  );
};
