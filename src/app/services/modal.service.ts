import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';
export interface Notification {
  message: string;
  status: 'success' | 'error';
}
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // BehaviorSubject будет хранить текущее уведомление (или null, если его нет)
  private notification$ = new BehaviorSubject<Notification | null>(null);

  // Даем возможность другим компонентам "слушать" уведомления
  getNotification(): Observable<Notification | null> {
    return this.notification$.asObservable();
  }

  // Главный метод для показа уведомления
  show(message: string, status: 'success' | 'error' = 'success', duration: number = 5000) {
    // 1. Показываем уведомление
    this.notification$.next({ message, status });

    // 2. Устанавливаем таймер на его скрытие
    setTimeout(() => {
      this.hide();
    }, duration);
  }

  // Метод, который "прячет" уведомление
  private hide(): void {
    this.notification$.next(null);
  }
}
