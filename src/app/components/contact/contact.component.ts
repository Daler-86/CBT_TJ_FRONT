// src/app/pages/contact/contact.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps'; // Убедись, что импорт есть
import { ContactService } from '../../api/contact.service';
import { ContactBlock } from '../../models/contact.model';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactBlocks: ContactBlock[] = [];
  imageUrl: string = environment.IMAGE_URL;
  // --- НАСТРОЙКИ ДЛЯ GOOGLE MAPS ---

  // 1. Центр карты (широта, долгота)
  // ЗАМЕНИ НА СВОИ РЕАЛЬНЫЕ КООРДИНАТЫ
  center: google.maps.LatLngLiteral = { lat: 38.56, lng: 68.77 };

  // 2. Уровень приближения
  zoom = 16;

  // 3. Массив с маркерами. В нашем случае - всего один маркер.
  markers: any[] = [
    {
      position: { lat: 38.56, lng: 68.77 }, // ЗАМЕНИ НА СВОИ КООРДИНАТЫ
      options: {
        // Опции для кастомной иконки
        icon: {
          url: '../../../assets/icons/Map Point.svg', // ЗАМЕНИ НА ПУТЬ К ТВОЕЙ ИКОНКЕ
          scaledSize: new google.maps.Size(50, 50)
        }
      }
    }
  ];

  // Переменная для хранения информации об активном маркере (для info-window)
  activeMarkerInfo: string | null = null;
  activeMarkerPosition: google.maps.LatLngLiteral | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe(res => {
      this.contactBlocks = res.data.contacts;
      
      // Здесь можно было бы брать координаты из API, если бы они там были.
      // Например:
      // const addressBlock = res.data.contacts.find(b => b.id === 2);
      // if (addressBlock) {
      //   this.center = this.parseCoordinates(addressBlock.data[0].coordinates);
      //   this.markers[0].position = this.center;
      // }
    });
  }

  // Показать информационное окно (info-window)
  showInfo(marker: any): void {
    // В нашем случае информация статична, т.к. маркер один
    this.activeMarkerInfo = `
      <strong>Головной офис</strong><br>
      ул. Бохтар 37/1
    `;
    this.activeMarkerPosition = marker.position;
  }

  // Скрыть информационное окно
  hideInfo(): void {
    this.activeMarkerInfo = null;
    this.activeMarkerPosition = null;
  }
}