import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsEventItem, news } from '../../models/news.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NewsService } from '../../api/news.service';
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {

  newsItems: NewsEventItem[] = [];
  constructor( private router: Router, private newsService:NewsService){}


  

  trackById(index: number, item: NewsEventItem): number {
    return item.id;
  }
  navigateToCardDetailsAndForm(cardId: number): void {
    this.router.navigate(['/news-detail', cardId], { queryParams: { scrollToForm: true } });
  }

  news:news[]=[]
  ngOnInit(): void {
    // Здесь позже будет логика получения данных с бэкенда
    console.log('Tender list initialized with mock data.');
    this.loadData()
  }

  @Input () totalPages: number = 0; // Общее количество страниц
  @Input() currentPage: number = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];
  tenderCount:number=0
  loadData(): void {
    
    this.newsService.getNewsList(2,this.currentPage).subscribe(
      (response) => {
        this.news = response.data.news;
        this.totalPages=Math.round(response.data.total_count/2)
        this.tenderCount=response.data.total_count;
        
        this.updatePages();
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
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
    this.loadData()
  }
  scrollToTop(): void {
    const listElement = document.querySelector('.list-container'); // Замените '.list-container' на ваш селектор списка
    if (listElement) {
      listElement.scrollTo({
        top: 0,
        behavior: 'smooth' // Плавная прокрутка
      });
    } else {
      // Если контейнер не найден, прокручиваем всю страницу
      window.scrollTo({
        top: 1,
        behavior: 'smooth' // Плавная прокрутка
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
