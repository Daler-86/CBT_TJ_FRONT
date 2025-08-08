import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tender, tender } from '../../models/tender.model';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TenderService } from '../../api/tender.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-tender',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule, TranslateModule],
  templateUrl: './tender.component.html',
  styleUrl: './tender.component.scss'
})
export class TenderComponent {

  // tenders: Tender[] = [
  //   {
  //     id: 1,
  //     description: 'Открытое акционерное общество «Коммерцбанк» приглашает организации принять участие в отборе (открытом конкурсе) на поставку решения системы FMS',
  //     startDate: '02.04.2025',
  //     endDate: '17.04.2025',
  //     status: 'Открытый'
  //   },
  //   {
  //     id: 2,
  //     description: 'Открытый тендер на поставку офисной бумаги и канцелярских товаров',
  //     startDate: '02.04.2025',
  //     endDate: '17.04.2025',
  //     status: 'Открытый'
  //   },
  //   {
  //     id: 3,
  //     description: 'Открытый тендер на приобретение лицензионного программного обеспечения',
  //     startDate: '02.04.2025',
  //     endDate: '17.04.2025',
  //     status: 'Открытый'
  //   },
  //   {
  //     id: 4,
  //     description: 'Открытый тендер на поставку годовой лицензии программного обеспечения Kaspersky Endpoint Security for Business Advanced',
  //     startDate: '04.10.2024',
  //     endDate: '14.04.2025',
  //     status: 'Завершенный'
  //   }
  //   // Можешь добавить больше тендеров для теста
  // ];
  constructor( private router: Router, private tenderService:TenderService){}

tenders:tender[]=[]
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
    
    this.tenderService.getTenderList(5,this.currentPage).subscribe(
      (response) => {
        this.tenders = response.data.tenders;
        debugger
        this.totalPages=Math.round(response.data.total_count/5)
        this.tenderCount=response.data.total_count
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

  trackById(index: number, item: Tender): number {
    return item.id;
}

navigateToCardDetailsAndForm(cardId: number): void {
  this.router.navigate(['/tender', cardId], { queryParams: { scrollToForm: true } });
}


}
