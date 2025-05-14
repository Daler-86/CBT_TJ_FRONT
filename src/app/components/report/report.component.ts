import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { VacanciesService } from '../../api/vacancies.service';
import { RegionService } from '../../api/region.service';
import { reportData, reportFile } from '../../models/report.model';
import { ReportService } from '../../api/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {


  reportData: any = {};
  // pdfIconPath: string = 'assets/icons/pdf-icon.svg'; // Путь к иконке

  constructor( private reportService:ReportService) { }

  ngOnInit(): void {
    this.loadData(); // Загружаем данные при инициализации
    this.loadReportFile();
    this.updatePages();
  }

  loadData(): void {
    
      this.reportService.getReportData().subscribe(
        (response) => {
          this.reportData = response.data.reports;
          // console.log('All cards loaded:', this.cardList);
        },
        (error) => {
          console.error('Ошибка при загрузке всех карт', error);
        }
      );
    }
  


  // Функции trackBy для оптимизации *ngFor
  trackByCardId(index: number, item: reportData): number {
    return item.id;
  }

  trackByDocumentId(index: number, item: reportFile): number {
    return item.id;
  }

  // Можно добавить trackBy для dataPoints, если они могут динамически меняться
  trackByDataPointLabel(index: number, item: reportData): string {
      return item.description; // Предполагаем, что label уникален внутри карточки
  }


  selectedCategory: string = '';
  selectedRegion: string = '';


  @Input () totalPages: number = 0; // Общее количество страниц
  @Input() currentPage: number = 1; // Текущая страница
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pages: number[] = [];

reportFile:reportFile[]=[]
vacancyCount:number=0
  loadReportFile() {

    this.reportService.getReportFile(2,this.currentPage).subscribe(
      (response) => {
        this.reportFile = response.data.report_files;
     
        this.totalPages=Math.round(response.data.total_count/2)
        this.vacancyCount=response.data.total_count
        this.updatePages(); 
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
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
    this.loadReportFile()
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
