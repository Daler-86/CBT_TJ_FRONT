import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,TranslateModule, RouterLink,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  selectedOption: string = '';
  showSubMenu: boolean = false;
  selectedLanguage = 'en';
  toggleSubMenu() {
    this.showSubMenu = !!this.selectedOption;
  }
  constructor(private translateService: TranslateService){}

  onLanguageChange() {
    console.log(this.selectedLanguage)
    this.translateService.use(this.selectedLanguage)
  }
  menuActive = false;

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
