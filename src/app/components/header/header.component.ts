import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ElementRef, HostListener } from '@angular/core';
import { MenuService } from '../../api/menu.service';
import { LanguagesService } from '../../languages.service';
import { Menu, MenuItem } from '../../models/menu.model';

import { Languages } from '../../shared/enums/languages.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterModule, TranslateModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  lang = Languages;
  menus: Menu[] = [];
  dropdownOpenMap: Record<number, boolean> = {};
  dropdownOpen = false;
  selectedLanguage: string = this.lang.Tj;
  menuActive = false;

  private subscriptions = new Subscription();

  languageOptions = [
    { value: this.lang.Tj, label: 'Тоҷикӣ' },
    { value: this.lang.Ru, label: 'Русский' },
    { value: this.lang.En, label: 'English' },
  ];

  public getDisplayLanguage(): string {
    switch (this.selectedLanguage) {
      case this.lang.Tj:
        return 'Тоҷ';
      case this.lang.Ru:
        return 'Рус';
      case this.lang.En:
        return 'En';
      default:
        return this.lang.Tj;
    }
  }
  logoSrc = '../../../assets/icons/logo_tj_big.png';
  private elementRef = inject(ElementRef);
  private router = inject(Router);
  private menuService = inject(MenuService);
  private translateService = inject(TranslateService);
  private languageService = inject(LanguagesService);
  showMore = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 1024) {
      this.closeMobileMenu(); 
    }
  }
  ngOnInit(): void {
    const langSub = this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
      this.translateService.use(lang);
      this.updateLogo(lang);
    });

    const menuSub = this.menuService.getMenu().subscribe(
      (response) => {
        this.menus = response.data.menus;
      },
      (error) => {
        console.error('Ошибка при получении меню', error);
      },
    );

    this.subscriptions.add(langSub);
    this.subscriptions.add(menuSub);
  }
  private updateLogo(language: Languages): void {
    switch (language) {
      case this.lang.Tj:
        this.logoSrc = '../../../assets/icons/logo_tj_big.png';
        break;
      case this.lang.Ru:
        this.logoSrc = '../../../assets/icons/logo_ru_big.png';
        break;
      case this.lang.En:
        this.logoSrc = '../../../assets/icons/logo_en_big.png';
        break;
      default:
        this.logoSrc = '../../../assets/icons/logo_tj_big.png';
    }
  }
  selectLanguage(option: { value: Languages; label: string }, event: Event) {
    event.stopPropagation();
    this.dropdownOpen = false;
    this.languageService.setLanguage(option.value);
    this.closeMobileMenu();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleDropdown1(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  toggleDropdown(index: number, event: Event) {
    event.stopPropagation();
    const isOpen = !!this.dropdownOpenMap[index];
    this.dropdownOpenMap = {};
    this.dropdownOpenMap[index] = !isOpen;
  }

  selectOption(option: MenuItem, index: number, event: Event, menuItem: Menu) {
    event.stopPropagation();
    this.dropdownOpenMap[index] = false;
    if (option.route) {
      this.menuService.changePersonTypeId(menuItem.person_type_id);
      this.router.navigate([option.route]);
      this.closeMobileMenu();
    }
    window.scrollTo(0, 0);
  }

  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.dropdownOpenMap = {};
      this.menuActive = false;
    }
  }

  closeDropdown(index: number) {
    this.dropdownOpenMap[index] = false;
  }
  closeMobileMenu() {
    this.menuActive = false;
    this.dropdownOpenMap = {};
    document.body.style.overflow = 'auto';
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuActive = !this.menuActive; 
    if (this.menuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
}
