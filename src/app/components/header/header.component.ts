import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ElementRef, HostListener } from '@angular/core';

// Ваши сервисы
import { MenuService } from '../../api/menu.service';
import { LanguagesService } from '../../languages.service';
import { Menu } from '../../models/menu.model';
import { DropdownService } from '../../services/dropdown.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menus: Menu[] = [];
  dropdownOpenMap: { [key: number]: boolean } = {};
  dropdownOpen = false;
  selectedLanguage: string = '1';
  menuActive = false;
  
  private subscriptions = new Subscription();

  languageOptions = [
    { value: '1', label: 'Тоҷикӣ' },
    { value: '2', label: 'Русский' },
    { value: '3', label: 'English' }
  ];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private menuService: MenuService,
    private dropdownService: DropdownService,
    private translateService: TranslateService,
    private languageService: LanguagesService
  ) {}

  ngOnInit(): void {
    const langSub = this.languageService.language$.subscribe(lang => {
      this.selectedLanguage = lang;
      this.translateService.use(lang);
    });

    const menuSub = this.menuService.getMenu().subscribe(
      (response) => { 
        this.menus = response.data.menus;
      },
      (error) => {
        console.error('Ошибка при получении меню', error);
      }
    );

    this.subscriptions.add(langSub);
    this.subscriptions.add(menuSub);
  }

  selectLanguage(option: { value: string; label: string }) {
    this.dropdownOpen = false;
    this.languageService.setLanguage(option.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // --- Остальные методы управления UI ---

  toggleDropdown1(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }
  
  toggleDropdown(index: number, event: Event) {
    this.dropdownOpenMap[index] = !this.dropdownOpenMap[index];
    event.stopPropagation();
  }

  selectOption(option: any, index: number, event: Event, menuItem: any) {  
    event.stopPropagation();
    this.dropdownOpenMap[index] = false;
    if (option.route) {
      this.menuService.changePersonTypeId(menuItem.person_type_id)
      this.router.navigate([option.route]);
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

  // ==== ВОТ ИСПРАВЛЕНИЕ: ВОЗВРАЩАЕМ НЕДОСТАЮЩИЙ МЕТОД ====
  closeDropdown(index: number) {
    this.dropdownOpenMap[index] = false;
  }
  // =======================================================

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}