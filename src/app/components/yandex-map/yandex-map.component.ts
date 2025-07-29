// yandex-map.component.ts

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule вместо AngularYandexMapsModule
import { AngularYandexMapsModule, YaReadyEvent } from 'angular8-yandex-maps';

// Объявляем глобальную переменную, чтобы TypeScript не ругался
declare const ymaps: any;

// Интерфейс для точек (если он еще не объявлен где-то в другом месте)
export interface IMapPoint {
  id: number | string;
  geometry: number[];
  properties: {
    type: 'atm' | 'office' | 'terminal';
    // Данные для кастомного балуна
    title: string;
    address: string;
    landmark: string;
    workHours: string;
    statusClass: string;
    iconSrc: string; // Путь к иконке для балуна
    // Данные для стандартного поведения
    hintContent: string;
    balloonContent: string;
  };
}

@Component({
  selector: 'app-yandex-map',
  standalone: true,
  imports: [CommonModule, AngularYandexMapsModule], // <-- ВОТ ЗДЕСЬ ОБЯЗАТЕЛЬНО ДОЛЖЕН БЫТЬ МОДУЛЬ
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss']
})
export class YandexMapComponent implements OnChanges {
  // --- ВХОДНЫЕ ДАННЫЕ ---
  @Input() points: IMapPoint[] = [];
  @Input() center: number[] = [38.561133, 68.773892];
  @Input() zoom: number = 12;

  // --- ВНУТРЕННИЕ СВОЙСТВА ---
  private objectManager?: ymaps.ObjectManager;

  private readonly iconPaths = {
    atm: 'assets/icons/atms.svg',
    terminal: 'assets/icons/terminals.svg',
    office: 'assets/icons/offices.svg'
  };

  // --- ЛОГИКА КОМПОНЕНТА ---

  onObjectManagerReady({ target }: YaReadyEvent<ymaps.ObjectManager>): void {
    this.objectManager = target;
    this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons'); // Сделаем кластеры зелеными
    this.createCustomBalloonLayout();
    this.createCustomIconLayouts();
    this.updateMapPoints();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.objectManager) {
      this.updateMapPoints();
    }
  }

  private createCustomIconLayouts(): void {
    const iconWidth = 56;
    const iconHeight = 56;

    Object.entries(this.iconPaths).forEach(([type, path]) => {
      const layoutKey = `my#${type}IconLayout`;
      ymaps.layout.storage.add(layoutKey, ymaps.templateLayoutFactory.createClass(
        `<img src="${path}" width="${iconWidth}" height="${iconHeight}" style="transform: translate(-${iconWidth / 2}px, -${iconHeight / 2}px);">`
      ));
    });
  }

  private createCustomBalloonLayout(): void {
    const balloonLayoutKey = 'my#customBalloonLayout';
    const CustomBalloonLayout = ymaps.templateLayoutFactory.createClass(
    `
    <div class="custom-balloon">
      <button class="custom-balloon__close-btn" title="Закрыть">×</button>
      <div class="custom-balloon__header">
        <img src="$[properties.iconSrc]" class="custom-balloon__icon" />
        <h3 class="custom-balloon__title">$[properties.title]</h3>
      </div>
      <div class="custom-balloon__body">
        <div class="custom-balloon__section">
          <div class="custom-balloon__label">Адрес</div>
          <div class="custom-balloon__value">$[properties.address]</div>
        </div>
        // {% if properties.landmark %} - так можно делать условные блоки
        {% if properties.landmark %}
        <div class="custom-balloon__section">
          <div class="custom-balloon__label">Ориентир</div>
          <div class="custom-balloon__value">$[properties.landmark]</div>
        </div>
        {% endif %}
        <div class="custom-balloon__section">
          <div class="custom-balloon__label">Время работы</div>
          <div class="custom-balloon__value custom-balloon__value--status $[properties.statusClass]">$[properties.workHours]</div>
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
          closeBtn.addEventListener('click', () => balloon.close());
        },
        clear: function () {
          const closeBtn = (this as any).getElement().querySelector('.custom-balloon__close-btn');
          if (closeBtn) {
             closeBtn.removeEventListener('click', () => {});
          }
          (this as any).constructor.superclass.clear.call(this);
        }
      }
    );
    ymaps.layout.storage.add(balloonLayoutKey, CustomBalloonLayout);
    if (this.objectManager) {
      this.objectManager.objects.options.set('balloonLayout', balloonLayoutKey);
      this.objectManager.objects.options.set('balloonPanelMaxMapArea', 0);
    }
  }

  private updateMapPoints(): void {
    if (!this.objectManager) return;
    this.objectManager.removeAll();
    const features = this.points.map(point => ({
      type: 'Feature',
      id: point.id,
      geometry: { type: 'Point', coordinates: point.geometry },
      properties: point.properties,
      options: { iconLayout: `my#${point.properties.type}IconLayout` }
    }));
    this.objectManager.add({ type: 'FeatureCollection', features: features });
  }
}