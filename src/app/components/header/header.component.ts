import { Component ,HostListener, ElementRef, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguagesService } from '../../languages.service';
import { NgFor, NgIf } from '@angular/common';
import { DropdownService } from '../../services/dropdown.service';
import { MenuService } from '../../api/menu.service';
import { Menu } from '../../models/menu.model';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  menus: Menu[] = [];
  dropdownOpenMap: { [key: number]: boolean } = {}; // Состояние для каждого селекта
  dropdownOpen = false; // Локальное состояние для языка
  selectedLanguage: string | null = localStorage.getItem('appLanguage');// Начальный выбранный язык
  menuActive = false;
  index: number;
  
  languageOptions = [
    { value: '1', label: 'Тоҷикӣ' },
    { value: '2', label: 'Русский' },
    { value: '3', label: 'English' }
  ];


  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private http: HttpClient,
    private menuService:MenuService,
    private dropdownService: DropdownService,
    private languageService: LanguagesService,
    private translateService: TranslateService
  ) {
    this.index = Math.floor(Math.random() * 10000); // Уникальный индекс для селектора
  }
  ngOnInit(): void {
    this.loadMenu();
  }  

  loadMenu(): void {
    this.menuService.getMenu().subscribe(
      (response) => { 
        this.menus = response.data.menus

        console.log(this.menus)
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
  toggleDropdown1(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.dropdownService.setOpenDropdown(this.index); // Уведомляем сервис, что открылся текущий селектор
    }
    event.stopPropagation(); // Останавливаем распространение клика
  }


    
  selectLanguage(option: any) {
    this.selectedLanguage = option.value;
    this.dropdownOpen = false; // Закрываем селектор после выбора  
    if(this.selectLanguage!==null){
      
    this.languageService.setLanguage(option.value);
    this.translateService.use(option.value);
    }

  }
  // Открытие/закрытие селекта по индексу
  toggleDropdown(index: number, event: Event) {
    this.dropdownOpenMap[index] = !this.dropdownOpenMap[index];
    event.stopPropagation(); // Останавливаем распространение события
  }

  selectOption(option: any, index: number, event: Event,menuItem:any) {  
    event.stopPropagation();
    this.dropdownOpenMap[index] = false;
    
    if (option.route) {
      this.menuService.changePersonTypeId(menuItem.person_type_id)
      this.router.navigate([option.route]);

    }
    window.scrollTo(0, 0);
  }

  // Управление языком
  toggleLanguageDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }


  // Закрытие всех дропдаунов при клике вне компонента
  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.dropdownOpenMap = {};
      this.menuActive = false;
    }
  }
  closeDropdown(index: number, event?: Event) {
    if (event) {
      event.stopPropagation(); // Останавливаем распространение события, если есть событие
    }
    this.dropdownOpenMap[index] = false;
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}