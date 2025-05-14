import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
export interface SocialLink {
  type: 'telegram' | 'whatsapp' | 'email' | 'facebook' | 'vk' | 'ok'; // Добавь нужные типы
  url: string; // Полный URL для шаринга (e.g., https://t.me/share/url?url=...)
  iconClass: string; // CSS класс для иконки (e.g., 'fab fa-telegram-plane')
  ariaLabel: string; // Для доступности
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
 articleTitle: string = 'Международное рейтинговое агентство «Moody\'s Investors Service»'; // Если нужен заголовок
 articleParagraphs: string[] = [
   'Международное рейтинговое агентство «Moody\'s Investors Service» 11 декабря 2024 года присвоило ОАО «Коммерцбанк Таджикистана» рейтинг на уровне «B3» с прогнозом «Стабильный».',
   'Полученная оценка является показателем стабильности и надежности банка, подтверждая его ведущие позиции на финансовом рынке Таджикистана. Присвоение данного рейтинга является закономерным результатом успешной работы и подтверждает, что Банк ведет открытую и прозрачную деятельность.',
   'Данная оценка обусловлена хорошим уровнем корпоративного управления, системы управления рисками, качеством активов, высокой достаточностью капитала, а также низким уровнем подверженности риску ликвидности.',
   'Данный рейтинг от Moody’s отражает кредитоспособность ОАО «Коммерцбанк Таджикистана», то есть способность выполнять свои финансовые обязательства, включая выплаты по долгам и процентам. Это важный индикатор для инвесторов, кредиторов и других участников рынка, поскольку рейтинг представляет степень надежности банка.',
   'Для справки: «Moody\'s Investors Service» является ведущим мировым рейтинговым агентством, который входит в «большую тройку».'
 ];
 imageUrls: string[] = [
   'assets/images/news-detail-1.jpg', // <-- ЗАМЕНИ ПУТИ
   'assets/images/news-detail-2.jpg',
   'assets/images/news-detail-3.jpg'
 ];

 // --- Данные для блока "Поделиться" ---
 socialLinks: SocialLink[] = [];
 pageUrl: string = '';
 copyButtonText: string = 'Скопировать ссылку';

 constructor(@Inject(DOCUMENT) private document: Document) {} // Внедряем DOCUMENT

 ngOnInit(): void {
   this.pageUrl = this.document.location.href; // Получаем URL текущей страницы
   this.generateSocialLinks(); // Генерируем ссылки для шаринга
 }

 generateSocialLinks(): void {
   const encodedUrl = encodeURIComponent(this.pageUrl);
   const title = encodeURIComponent(this.document.title); // Берем заголовок страницы

   this.socialLinks = [
     { type: 'telegram', url: `https://t.me/share/url?url=${encodedUrl}&text=${title}`, iconClass: 'fab fa-telegram-plane', ariaLabel: 'Поделиться в Telegram' },
     { type: 'whatsapp', url: `https://api.whatsapp.com/send?text=${title}%20${encodedUrl}`, iconClass: 'fab fa-whatsapp', ariaLabel: 'Поделиться в WhatsApp' },
     // { type: 'email', url: `mailto:?subject=${title}&body=${encodedUrl}`, iconClass: 'fas fa-envelope', ariaLabel: 'Отправить по Email' }, // Раскомментируй если нужно Email
     { type: 'facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, iconClass: 'fab fa-facebook-f', ariaLabel: 'Поделиться в Facebook' },
     // Добавь другие сети по аналогии (ВК, ОК и т.д.)
     // { type: 'vk', url: `https://vk.com/share.php?url=${encodedUrl}&title=${title}`, iconClass: 'fab fa-vk', ariaLabel: 'Поделиться ВКонтакте' },
   ];
 }

 async copyLink(): Promise<void> {
   try {
     await navigator.clipboard.writeText(this.pageUrl);
     this.copyButtonText = 'Ссылка скопирована!';
     // Возвращаем исходный текст через некоторое время
     setTimeout(() => {
       this.copyButtonText = 'Скопировать ссылку';
     }, 2000);
   } catch (err) {
     console.error('Ошибка копирования ссылки: ', err);
     this.copyButtonText = 'Ошибка копирования';
      setTimeout(() => {
       this.copyButtonText = 'Скопировать ссылку';
     }, 2000);
   }
 }

 // TrackBy функции для оптимизации
 trackByIndex(index: number): number {
   return index;
 }

 trackBySocialType(index: number, item: SocialLink): string {
     return item.type;
 }
}
