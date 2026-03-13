import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularYandexMapsModule, YaReadyEvent } from 'angular8-yandex-maps';
import { TerminalItem } from '../../models/region.model';
import { IMapPoint, Services } from '../../models/map.model';



@Component({
  selector: 'app-yandex-map',
  standalone: true,
  imports: [CommonModule, AngularYandexMapsModule],
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss'],
})
export class YandexMapComponent implements OnChanges {
  @Input() points: IMapPoint[] = [];
  @Input() center: number[] = [38.561133, 68.773892];
  @Input() zoom = 12;
  @Input() selectedPointId: number | string | null = null;
  @Output() pointClick = new EventEmitter<IMapPoint>();
  @Output() mapClick = new EventEmitter<void>();

  private mapInstance?: ymaps.Map;
  private objectManager?: ymaps.ObjectManager;
  private readonly iconSize = { width: 36, height: 36 };

  onMapReady(event: YaReadyEvent) {
    this.mapInstance = event.target;

    this.mapInstance?.events.add('click', (e: ymaps.IEvent) => {
      const target = e.get('target');
      if (target instanceof ymaps.Map) {
        this.mapClick.emit();
      }
    });

    this.mapInstance?.options.set('suppressMapOpenBlock', true);
  }

  onObjectManagerReady({ target }: YaReadyEvent<ymaps.ObjectManager>): void {
    this.objectManager = target;
    this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');

    this.objectManager.objects.events.add('click', (e: ymaps.IEvent) => {
      e.stopImmediatePropagation();
      const objectId = e.get('objectId');
      const pointData = this.points.find((p) => p.id === objectId);
      if (pointData) {
        this.pointClick.emit(pointData);
      }
    });

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
      const currentPoint = this.points.find((p) => p.id === this.selectedPointId);
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
      office_inactive: 'assets/icons/office_inactive.svg',
    };
    Object.entries(iconPaths).forEach(([type, path]) => {
      const layoutKey = `my#${type}IconLayout`;
      const template = `<img
                            src="${path}"
                            width="${this.iconSize.width}"
                            height="${this.iconSize.height}"
                            style="transform: translate(-${this.iconSize.width / 2}px, -${this.iconSize.height / 2}px);"
                        >`;
      ymaps.layout.storage.add(layoutKey, ymaps.templateLayoutFactory.createClass(template));
    });
  }

  private updateMapPoints(): void {
    if (!this.objectManager) return;
    this.objectManager.removeAll();

    const features = this.points.map((point) => ({
      type: 'Feature',
      id: point.id,
      geometry: point.geometry,
      properties: point.properties,
      options: {
        iconLayout: `my#${point.properties.type}IconLayout`,
        iconShape: {
          type: 'Rectangle',
          coordinates: [
            [-this.iconSize.width / 2, -this.iconSize.height / 2],
            [this.iconSize.width / 2, this.iconSize.height / 2],
          ],
        },
        hasBalloon: false,
      },
    }));

    this.objectManager.add({ type: 'FeatureCollection', features: features });
  }
}
