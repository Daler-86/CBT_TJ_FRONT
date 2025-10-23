import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  // Сервис будет хранить индекс открытого селектора, -1 означает, что ни один не открыт
  private openDropdownIndex = new BehaviorSubject<number>(-1);

  // Подписка на изменение состояния (текущий открытый селектор)
  currentOpenDropdown$ = this.openDropdownIndex.asObservable();

  // Метод для установки открытого селектора
  setOpenDropdown(index: number) {
    this.openDropdownIndex.next(index);
  }

  // Метод для закрытия всех селекторов
  closeAllDropdowns() {
    this.openDropdownIndex.next(-1);
  }
}
