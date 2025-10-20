// Интерфейс для элемента новости/события
export interface NewsEventItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  // Опционально: ссылка для перехода при клике на карточку/заголовок
  linkUrl?: string;
}
export interface fullNews {
  id: number;
  title?: string;
  description?: string;
  date_time?: string;
  upload_file?: string;
  shortDescription: string;
}

export interface news {
  id: number;
  title?: string;
  description?: string;
  date_time?: string;
  upload_file?: string;
}
export interface NewsData {
  status: string;
  status_code: string;
  data: {
    total_count: number;
    news: news[];
  };
}

export interface NewsDetailData {
  status: string;
  status_code: string;
  data: {
    news: news;
  };
}
