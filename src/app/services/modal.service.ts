import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  status: 'success' | 'error';
}
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private notification$ = new BehaviorSubject<Notification | null>(null);
  getNotification(): Observable<Notification | null> {
    return this.notification$.asObservable();
  }

  show(message: string, status: 'success' | 'error' = 'success', duration = 5000) {
    this.notification$.next({ message, status });

    setTimeout(() => {
      this.hide();
    }, duration);
  }

  private hide(): void {
    this.notification$.next(null);
  }
}
