import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NewsDetailData, news } from '../../models/news.model';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../api/news.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // <-- Все еще нужен для SafeHtml
import { inject } from '@angular/core/testing';
interface SocialLink {
  type: string;
  url: string;
  ariaLabel: string;
  iconClass: string;
 }
@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent {
 // --- Данные для статьи (замени на реальные) ---

 imageUrls: string[] = [
   'assets/images/news-detail-1.jpg', 
   'assets/images/news-detail-2.jpg',
   'assets/images/news-detail-3.jpg'
 ];

 // --- Данные для блока "Поделиться" ---
 socialLinks: SocialLink[] = [];
 pageUrl: string = '';
 copyButtonText: string = 'Скопировать ссылку';

 constructor(@Inject(DOCUMENT) private document: Document,
 private route: ActivatedRoute,
 private newsService:NewsService
 ) {} // Внедряем DOCUMENT

 cardId: number=0;
newDetailData:any={}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId= +idParam;  // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }
    this.loadCards(this.cardId);
  }

  loadCards(id:number):void {
    this.newsService.getNewsDetailData(id).subscribe(
      (response) => {

        this.newDetailData = response.data.news;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }

 



 // TrackBy функции для оптимизации
 trackByIndex(index: number): number {
   return index;
 }

 trackBySocialType(index: number, item: SocialLink): string {
     return item.type;
 }

}
