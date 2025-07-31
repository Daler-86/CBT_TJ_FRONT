// src/app/yandex-map/yandex-map.component.ts

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularYandexMapsModule, YaReadyEvent } from 'angular8-yandex-maps';

declare const ymaps: any;

export interface IMapPoint {
  id: number | string;
  geometry: number[];
  properties: {
    type: 'atm' | 'office' | 'terminal';
    title: string;
    address: string;
    landmark: string;
    workHours: string;
    statusClass: string;
    iconSrc: string;
 
    balloonContent: string;
  };
}

@Component({
  selector: 'app-yandex-map',
  standalone: true,
  imports: [CommonModule, AngularYandexMapsModule],
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss']
})
export class YandexMapComponent implements OnChanges {
  @Input() points: IMapPoint[] = [];
  @Input() center: number[] = [38.561133, 68.773892];
  @Input() zoom: number = 12;

  private objectManager?: ymaps.ObjectManager;

  private readonly iconPaths = {
    atm: '../../../assets/icons/atms.svg',
    terminal: '../../../assets/icons/terminals.svg',
    office: '../../../assets/icons/offices.svg'
  };

  async onObjectManagerReady({ target }: YaReadyEvent<ymaps.ObjectManager>) {
    this.objectManager = target;

    // остальные настройки
    this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    this.createCustomBalloonLayout();
    this.createCustomIconLayouts();

    this.objectManager.objects.options.set('balloonLayout', 'my#customBalloonLayout');
    this.objectManager.objects.options.set('balloonPanelMaxMapArea', 0);
    this.objectManager.objects.options.set('cursor', 'pointer');




    // ✅ клик по точке
    this.objectManager.objects.events.add('click', (e: any) => {
      const objectId = e.get('objectId');
      console.log('Клик по точке:', objectId);
      const objectData = this.objectManager?.objects.getById(objectId);
      console.log('Найден объект:', objectData);
    });

    await this.loadOfficePoints();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.objectManager) {
      this.updateMapPoints();
    }
  }
  private createCustomBalloonLayout(): void {
    const balloonLayoutKey = 'my#customBalloonLayout';

    const CustomBalloonLayout = ymaps.templateLayoutFactory.createClass(
      `
      <div class="custom-balloon">
        <button class="custom-balloon__close-btn" title="Закрыть">×</button>
        <div class="custom-balloon__header">
          <h3 class="custom-balloon__title">$[properties.type]</h3>
        </div>
        <div class="custom-balloon__body">
          <div class="custom-balloon__section">
            <div class="custom-balloon__label">Адрес</div>
            <div class="custom-balloon__value">$[properties.fullAddress]</div>
          </div>

        

          <div class="custom-balloon__section">
            <div class="custom-balloon__label">Время работы</div>
            <div class="custom-balloon__value">
               ${'$[properties.workHours]'}<br> 

            </div>
          </div>

    
        </div>
        <div class="custom-balloon__arrow"></div>
      </div>
      `,
      {
        build: function () {
          (this as any).constructor.superclass.build.call(this);
          const closeBtn = (this as any).getElement().querySelector('.custom-balloon__close-btn');
          const balloon = (this as any)._data.balloon;
          if(closeBtn) {
            closeBtn.addEventListener('click', () => balloon.close());
          }
        },
        clear: function () {
          const closeBtn = (this as any).getElement().querySelector('.custom-balloon__close-btn');
          if (closeBtn) {
            const newBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newBtn, closeBtn);
          }
          (this as any).constructor.superclass.clear.call(this);
        }
      }
    );

    ymaps.layout.storage.add(balloonLayoutKey, CustomBalloonLayout);
  }
  private createCustomIconLayouts(): void {
    const iconWidth = 42;
    const iconHeight = 42;

    Object.entries(this.iconPaths).forEach(([type, path]) => {
      const layoutKey = `my#${type.replace(/\s+/g, '')}IconLayout`;
      ymaps.layout.storage.add(layoutKey, ymaps.templateLayoutFactory.createClass(
        `<div style="
      width: ${iconWidth}px;
      height: ${iconHeight}px;
      background: url(${path}) no-repeat center center / contain;
      transform: translate(-21px, -21px);
      cursor: pointer;
      pointer-events: auto;
    "></div>`
      ));

    });
  }
  private async loadOfficePoints() {
    if (!this.objectManager) return;
    for (let i = 0; i < this.points.length; i++) {
    
      const office = this.points[i];
      const fullAddress = `${office.properties.address}`;

      try {
        const res = await ymaps.geocode(fullAddress);
        const geoObject = res.geoObjects.get(0);

        if (!geoObject || !geoObject.geometry) {
          console.warn('Адрес не найден:', fullAddress);
          continue;
        }

        const coords = geoObject.geometry.getCoordinates();
        const iconType = office.properties.type 
debugger
        // Создаем HTML-содержимое для балуна
        const balloonContent =
       ` <div>
        <strong>${office.properties.type}</strong><br>
        <b>Адрес:</b> ${fullAddress}<br>
        <b>Телефон:</b> ${office.properties.address || 'не указан'}<br>
        <b>Режим работы:</b><br>
        Пн-Пт: ${office.properties.landmark}<br>
        Сб: ${office.properties.workHours|| 'выходной'}
      </div>
    `;

      this.objectManager.add({
        type: 'Feature',
        id: i,
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
        properties: {
          type: office.properties.type,
          fullAddress: fullAddress,
          phone: office.properties.title,
          workingHours: office.properties.workHours,
          balloonContent: balloonContent,
        },
        options: {
          iconLayout: `my#${iconType}IconLayout`,
          balloonContentLayout: 'my#customBalloonLayout',
          hideIconOnBalloonOpen: false,
          balloonCloseButton: false,
          cursor: 'pointer',
          zIndex: 9999,
          iconShape: {
            type: 'Circle',
            coordinates:  [0, 0],
            radius: 21,
          }
        }
      });
    } catch (error) {
      console.warn('Ошибка геокодирования:', fullAddress, error);
    }
    
  }
    // ymaps.layout.storage.add(balloonLayoutKey, CustomBalloonLayout);
  }

  private updateMapPoints(): void {
    if (!this.objectManager) return;
    this.objectManager.removeAll();
    const features = this.points.map(point => ({
      type: 'Feature',
      id: point.id,
      geometry: { type: 'Point', coordinates: point.geometry },
   
      properties: point.properties,
      options: {
        iconLayout:`my#${point.properties.type}IconLayout`
      },
      balloonLayout: 'my#customBalloonLayout',
      balloonPanelMaxMapArea: 0 
    }));
    this.objectManager.add({ type: 'FeatureCollection', features: features });
  }
}