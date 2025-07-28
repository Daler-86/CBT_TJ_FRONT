import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-acquiring-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './acquiring-page.component.html',
  styleUrl: './acquiring-page.component.scss'
})
export class AcquiringPageComponent {
 // Переменная для хранения ID активного таба
 public activeTab: string = 'pos';

 // Метод для смены таба
 selectTab(tabId: string): void {
   this.activeTab = tabId;
 }
}
