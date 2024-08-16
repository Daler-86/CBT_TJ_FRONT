import { Component } from '@angular/core';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule,RouterModule,TranslateModule, RouterLink,RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
