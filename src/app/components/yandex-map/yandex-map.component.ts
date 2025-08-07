// src/app/yandex-map/yandex-map.component.ts

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularYandexMapsModule, YaReadyEvent } from 'angular8-yandex-maps';

declare const ymaps: any;

export interface IMapPoint {
  id: number | string;
  geometry: { type: 'Point'; coordinates: number[] };
  properties: any;
  
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
  @Input() selectedPointId: number | string | null = null;
  // --- СОБЫТИЯ ДЛЯ РОДИТЕЛЯ ---
  @Output() pointClick = new EventEmitter<IMapPoint>();
  @Output() mapClick = new EventEmitter<void>();

  private mapInstance?: ymaps.Map;
  private objectManager?: ymaps.ObjectManager;
  private readonly iconSize = { width: 36, height: 36 };

  onMapReady(mapComponent: any): void {
    this.mapInstance = mapComponent.map;
    // Отключаем кликабельность стандартных POI Яндекса
    this.mapInstance?.options.set('suppressMapOpenBlock', true);
  }

  onObjectManagerReady({ target }: YaReadyEvent<ymaps.ObjectManager>): void {
    this.objectManager = target;
    this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

    // --- ИСПРАВЛЕННАЯ ЛОГИКА КЛИКОВ ---
    // Клик по отдельному объекту
    this.objectManager.objects.events.add('click', (e: any) => {
      e.stopImmediatePropagation(); // Предотвращаем "проваливание" клика на карту
      const objectId = e.get('objectId');
      const pointData = this.points.find(p => p.id === objectId);
      if (pointData) {
        this.pointClick.emit(pointData);
      }
    });

    // Клик по кластеру (приближаем карту)
    this.objectManager.clusters.events.add('click', (e: any) => {
      e.stopImmediatePropagation();
      const cluster = e.get('target');
      if (this.mapInstance) {
               // panTo не возвращает Promise, поэтому делаем последовательные вызовы
               this.mapInstance.panTo(cluster.geometry.getCoordinates(), { duration: 500 });
               // Используем setTimeout, чтобы зум сработал после завершения panTo
               setTimeout(() => {
                   if (this.mapInstance) {
                       this.mapInstance.setZoom(this.mapInstance.getZoom() + 1, { duration: 500 });
                   }
               }, 500);
       
      }
    });
    
    // Клик по самой карте (чтобы закрыть боковую панель)
    this.mapInstance?.events.add('click', () => {
        this.mapClick.emit();
    });

    this.createIconLayouts();
    this.updateMapPoints();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.objectManager) {
      this.updateMapPoints();
    }

    if (changes['selectedPointId'] && this.mapInstance) {
      const currentPoint = this.points.find(p => p.id === this.selectedPointId);
      if (currentPoint) {
        const coords = currentPoint.geometry.coordinates;
        this.mapInstance.panTo(coords, { duration: 500, flying: true });
      }
    }
  }

  private createIconLayouts(): void {
    const iconPaths = {
      atm: 'assets/icons/atms.svg',
      terminal: 'assets/icons/terminals.svg',
      office: 'assets/icons/offices.svg',
      office_inactive: 'assets/icons/office_inactive.svg', // Иконка для неактивного офиса
    };
    Object.entries(iconPaths).forEach(([type, path]) => {
      const layoutKey = `my#${type}IconLayout`;
      const template = `<img src="${path}" width="${this.iconSize.width}" height="${this.iconSize.height}" style="transform: translate(-${this.iconSize.width / 2}px, -${this.iconSize.height / 2}px);">`;
      ymaps.layout.storage.add(layoutKey, ymaps.templateLayoutFactory.createClass(template));
    });
  }

  private updateMapPoints(): void {
    if (!this.objectManager) return;
    this.objectManager.removeAll();
    
    const features = this.points.map(point => ({
      type: 'Feature',
      id: point.id,
      geometry: point.geometry,
      properties: point.properties,
      options: {
        iconLayout: `my#${point.properties.type}IconLayout`, // Здесь можно добавить логику для неактивных иконок
        iconShape: {
          type: 'Rectangle',
          coordinates: [
            [-this.iconSize.width / 2, -this.iconSize.height / 2],
            [this.iconSize.width / 2, this.iconSize.height / 2]
          ]
        },
        // --- ОТКЛЮЧАЕМ БАЛУНЫ ПОЛНОСТЬЮ ---
        hasBalloon: false
      }
    }));

    this.objectManager.add({ type: 'FeatureCollection', features: features });
  }
}