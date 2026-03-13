
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../api/report.service';
import { reportData, reportFile } from '../../models/report.model';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  reportData: reportData | null = null;

  availableYears: number[] = [];

  currentApiYear: number | null = 0;

  selectedYear: number | null = null;

  reportFile: reportFile[] = [];
  totalPages = 0;
  currentPage = 1;
  pages: number[] = [];
  private reportService = inject(ReportService);

  ngOnInit(): void {
    this.loadInitialData();
    this.loadReportFile();
  }

  loadInitialData(): void {
    this.reportService.getReportData(0).subscribe({
      next: (response) => {
        const initialReportsData = response.data.reports;
        this.sortReportData(initialReportsData);

        this.reportData = initialReportsData;

        this.currentApiYear = initialReportsData.report_year;
        this.selectedYear = 0;

        const yearsSet = new Set([this.currentApiYear, ...initialReportsData.report_years]);
        this.availableYears = Array.from(yearsSet);
      },
      error: (error) => console.error('Ошибка при первоначальной загрузке данных', error),
    });
  }


  onYearChange(yearValue: number): void {

    this.selectedYear = yearValue;
    this.reportService.getReportData(yearValue).subscribe({
      next: (response) => {
        const newReportsData = response.data.reports;
        this.reportData = { ...newReportsData };

        this.sortReportData(newReportsData);
      },
      error: (error) => console.error(`Ошибка при загрузке данных за год`, error),
    });
  }

  private sortReportData(data: reportData): void {
    if (data && data.report_indicator) {
      data.report_indicator.sort((a, b) => a.sort_id - b.sort_id);
      data.report_indicator.forEach((indicator) => {
        if (indicator.report_indicator_data) {
          indicator.report_indicator_data.sort((a, b) => a.sort_id - b.sort_id);
        }
      });
    }
  }

  trackByCardId(item: number): number {
    return item;
  }
  trackByDocumentId(item: reportFile): number {
    return item.id;
  }
  loadReportFile() {
    this.reportService.getReportFile(5, this.currentPage).subscribe({
      next: (response) => {
        this.reportFile = response.data.report_files;
        this.totalPages = Math.ceil(response.data.total_count / 2);
        this.updatePages();
      },
      error: (error) => {
        console.error('Ошибка при запросе файлов отчета', error);
      },
    });
  }
  updatePages() {
    this.pages = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
      return;
    }
    this.pages.push(1);
    if (this.currentPage > 3) {
      this.pages.push(-1);
    }
    const startPage = Math.max(2, this.currentPage - 1);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
    if (this.currentPage < this.totalPages - 2) {
      this.pages.push(-1);
    }
    this.pages.push(this.totalPages);
  }
  selectPage(page: number) {
    if (page === -1 || page === this.currentPage) return;
    this.currentPage = page;
    this.loadReportFile();
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.selectPage(this.currentPage + 1);
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.selectPage(this.currentPage - 1);
    }
  }
}
