// src/app/pages/contact/contact.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GoogleMapsModule } from '@angular/google-maps'; // Убедись, что импорт есть
import { ContactService } from '../../api/contact.service';
import { ContactBlock } from '../../models/contact.model';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { IMapPoint, YandexMapComponent } from '../yandex-map/yandex-map.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, YandexMapComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactBlocks: ContactBlock[] = [];
  imageUrl: string = environment.IMAGE_URL;
  // --- НАСТРОЙКИ ДЛЯ GOOGLE MAPS ---

  // 1. Центр карты (широта, долгота)
  // ЗАМЕНИ НА СВОИ РЕАЛЬНЫЕ КООРДИНАТЫ
  // center: google.maps.LatLngLiteral = { lat: 38.56, lng: 68.77 };

  // 2. Уровень приближения
  zoom = 16;
  public headOfficePoint: IMapPoint[] = [];



  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe(res => {
      this.contactBlocks = res.data.contacts;
      
  
    });

    this.createHeadOfficeMapPoint();
  }

  private createHeadOfficeMapPoint(): void {
    // Здесь вы можете взять данные из вашего API или задать их статически
    const headOfficeData = {
      id: 1,
      name: 'Головной офис CBT Банк',
      address: 'г. Душанбе, проспект Рудаки, 105',
      // Точные координаты вашего головного офиса
      latitude: '38.575678', 
      longitude: '68.782045'
    };
    
    this.headOfficePoint = [{
      id: headOfficeData.id,
      // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ ---
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(headOfficeData.latitude), parseFloat(headOfficeData.longitude)]
      },
      properties: {
        type: 'office',
        title: headOfficeData.name,
        address: headOfficeData.address,
        landmark: 'Ориентир головного офиса',
        workHours: 'Пн-Пт: 09:00 - 18:00',
        statusClass: 'status--open',
        iconSrc: 'assets/icons/offices.svg',
        services: []
      }
    }];
  
  }
 




}