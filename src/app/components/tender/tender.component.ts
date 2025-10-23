import { Component, EventEmitter, Input, Output, OnInit, OnChanges, inject } from '@angular/core';
import { Tender, tender } from '../../models/tender.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TenderService } from '../../api/tender.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-tender',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './tender.component.html',
  styleUrl: './tender.component.scss',
})
export class TenderComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private tenderService = inject(TenderService);

  tenders: tender[] = [];
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
    this.tenderService.getTenderList(5, this.currentPage).subscribe(
      (response) => {
        this.tenders = response.data.tenders;
        this.totalPages = Math.round(response.data.total_count / 5);
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

  trackById(index: number, item: Tender): number {
    return item.id;
  }

  navigateToCardDetailsAndForm(cardId: number): void {
    this.router.navigate(['/tender', cardId], { queryParams: { scrollToForm: true } });
  }
}
