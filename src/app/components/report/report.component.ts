// report.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../api/report.service';
import { reportData, reportFile } from '../../models/report.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
   // Данные для карточек
   reportData: reportData | null = null;
  
   // Список всех годов для кнопок, например [2025, 2024]
   availableYears: number[] = [];
   
   // Какой год API считает "главным" (например, 2025). Определяется один раз.
   currentApiYear: number | null = 0;
   
   // Какой год ВЫБРАН сейчас (например, 2025 или 2024). Меняется при клике.
   selectedYear: number | null = null;
 
   // --- Переменные для файлов ---
   reportFile: reportFile[] = [];
   totalPages: number = 0;
   currentPage: number = 1;
   pages: number[] = [];
 
   constructor(private reportService: ReportService) { }
 
   ngOnInit(): void {
     // Запускаем специальную функцию для первой загрузки
     this.loadInitialData();
     this.loadReportFile();
   }
 
   /**
    * Запускается ТОЛЬКО ОДИН РАЗ.
    * Узнает, какой год "текущий", и формирует список кнопок.
    */
   loadInitialData(): void {
     // Запрос без года, чтобы получить данные по умолчанию
     this.reportService.getReportData(0).subscribe({
       next: (response) => {
         const initialReportsData = response.data.reports;
         this.sortReportData(initialReportsData);
         
         // 1. Показываем начальные данные
         this.reportData = initialReportsData;
         
         // 2. ЗАПОМИНАЕМ, какой год API считает главным
         this.currentApiYear = initialReportsData.report_year;
         
         // 3. Устанавливаем его как выбранный по умолчанию
         this.selectedYear = this.currentApiYear;
         
         // 4. Формируем ПОЛНЫЙ список годов для кнопок (один раз и навсегда)
         const yearsSet = new Set([this.currentApiYear, ...initialReportsData.report_years]);
         this.availableYears = Array.from(yearsSet).sort((a, b) => b - a);
       },
       error: (error) => console.error('Ошибка при первоначальной загрузке данных', error)
     });
   }
 
   /**
    * Вызывается при нажатии на ЛЮБУЮ кнопку года.
    * @param yearValue - Значение, привязанное к кнопке (0 для "Текущего", 2024 для "2024")
    */
   onYearChange(yearValue: number): void {
     // Определяем, какому реальному году соответствует нажатая кнопка
    //  const targetYear = (yearValue === 0) ? t : yearValue;
 
     // Если этот год уже выбран, ничего не делаем
    //  if (this.selectedYear === targetYear) {
    //    return;
    //  }
 
     // 1. Обновляем выбранный год, чтобы кнопка сразу подсветилась
     this.selectedYear = yearValue;
     
    //  // 2. Определяем, что отправить в API (undefined для "Текущего", число для остальных)
    //  const yearToSend = (yearValue === 0) ? undefined : yearValue;

    //  // 3. Загружаем новые данные
     this.reportService.getReportData(yearValue).subscribe({
      
       next: (response) => {
        debugger
         const newReportsData = response.data.reports;
         this.reportData = { ...newReportsData };

         this.sortReportData(newReportsData);
        //  this.reportData = newReportsData; // Обновляем данные для карточек
       },
       error: (error) => console.error(`Ошибка при загрузке данных за год`, error)
     });
   }
 
   /** Вспомогательная функция для сортировки */
   private sortReportData(data: reportData): void {
     if (data && data.report_indicator) {
       data.report_indicator.sort((a, b) => a.sort_id - b.sort_id);
       data.report_indicator.forEach(indicator => {
         if (indicator.report_indicator_data) {
           indicator.report_indicator_data.sort((a, b) => a.sort_id - b.sort_id);
         }
       });
     }
   }
  
  // --- Код для пагинации файлов (без изменений) ---
  trackByCardId(index: number, item: any): number { return item.id; }
  trackByDocumentId(index: number, item: reportFile): number { return item.id; }
  loadReportFile() {
    this.reportService.getReportFile(2, this.currentPage).subscribe({
      next: (response) => {
        this.reportFile = response.data.report_files;
        this.totalPages = Math.ceil(response.data.total_count / 2);
        this.updatePages();
      },
      error: (error) => {
        console.error('Ошибка при запросе файлов отчета', error);
      }
    });
  }
  updatePages() {
    this.pages = [];
    if (this.totalPages <= 5) { for (let i = 1; i <= this.totalPages; i++) { this.pages.push(i); } return; }
    this.pages.push(1);
    if (this.currentPage > 3) { this.pages.push(-1); }
    const startPage = Math.max(2, this.currentPage - 1);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
    for (let i = startPage; i <= endPage; i++) { this.pages.push(i); }
    if (this.currentPage < this.totalPages - 2) { this.pages.push(-1); }
    this.pages.push(this.totalPages);
  }
  selectPage(page: number) { if (page === -1 || page === this.currentPage) return; this.currentPage = page; this.loadReportFile(); }
  nextPage() { if (this.currentPage < this.totalPages) { this.selectPage(this.currentPage + 1); } }
  prevPage() { if (this.currentPage > 1) { this.selectPage(this.currentPage - 1); } }
}