import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleApplicationFormComponent } from "../simple-application-form/simple-application-form.component";

@Component({
  selector: 'app-acquiring-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, SimpleApplicationFormComponent],
  templateUrl: './acquiring-page.component.html',
  styleUrl: './acquiring-page.component.scss'
})
export class AcquiringPageComponent {
 // Переменная для хранения ID активного таба
 public activeTab: string = 'pos';
 public readonly acquiringApiUrl = '/order/acquiring/save'
 // Метод для смены таба
 selectTab(tabId: string): void {
   this.activeTab = tabId;
 }
}
