import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleApplicationFormComponent } from "../simple-application-form/simple-application-form.component";
import { ScrollToDirective } from '../../directives/scroll-to.directive';
@Component({
  selector: 'app-acquiring-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, SimpleApplicationFormComponent, ScrollToDirective],
  templateUrl: './acquiring-page.component.html',
  styleUrl: './acquiring-page.component.scss'
})
export class AcquiringPageComponent {
 // Переменная для хранения ID активного таба
 public activeTab: string = 'pos'; 
 selectedTab: string = 'all';
 public readonly acquiringApiUrl = '/order/acquiring/save'
 // Метод для смены таба
 selectTab1(tabId: string): void {
   this.activeTab = tabId;
 }
 selectTab(tab: string) {
  this.selectedTab = tab;
}

}
