import { Component ,HostListener, ElementRef, OnInit} from '@angular/core';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguagesService } from '../../languages.service';
import { NgFor, NgIf } from '@angular/common';
import { DropdownService } from '../../services/dropdown.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  dropdownOpen = false; // Локальное состояние компонента
  selectedLanguage: string = '1';// Выбранный язык для селектора
  index: number; // Индекс текущего селектора (уникальный для каждого селектора)
  dropdownOpen1=false
  dropdownOpen2=false
  languageOptions = [
    { value: '1', label: 'Тоҷикӣ' },
    { value: '2', label: 'Русский' },
    { value: '3', label: 'English' }
  ];
  options=[
    { value: '1', label: 'Карты' },
    { value: '2', label: 'Кредиты' },
    { value: '3', label: 'Вклады' },
    { value: '4', label: 'Переводы' },
    { value: '5', label: 'Автокредит' },
    { value: '6', label: 'Страхование' },
    {value:"7",label:"Курсы валют"}
  ]
  Options=[
    { value: '1', label: 'Новости' },
    { value: '2', label: 'Тендеры' },
    { value: '3', label: 'Вакансии' },
  ]
  constructor(private elementRef: ElementRef, private dropdownService: DropdownService, private translateService: TranslateService, private languageService: LanguagesService) {
    // Задаем уникальный индекс для каждого селектора (например, можно использовать случайное число или индекс из родительского компонента)
    this.index = Math.floor(Math.random() * 10000); // Уникальный идентификатор для селектора
  }

  ngOnInit() {
    // Подписываемся на изменения в сервисе, чтобы закрывать текущий селектор, если открылся другой
    this.dropdownService.currentOpenDropdown$.subscribe(openIndex => {
      if (openIndex !== this.index) {
        this.dropdownOpen = false;
        this.dropdownOpen1=false
        this.dropdownOpen2=false // Закрываем селектор, если открыт другой
      }
    });
  }

  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.dropdownService.setOpenDropdown(this.index); // Уведомляем сервис, что открылся текущий селектор
    }
    event.stopPropagation(); // Останавливаем распространение клика
  }

  toggleDropdown1(event: Event) {
    this.dropdownOpen1 = !this.dropdownOpen1;
    if (this.dropdownOpen1) {
      this.dropdownService.setOpenDropdown(this.index); // Уведомляем сервис, что открылся текущий селектор
    }
    event.stopPropagation(); // Останавливаем распространение клика
  }
  selectOption(option: any) {
    this.dropdownOpen1 = false;
  }
    
  toggleDropdown2(event: Event) {
    this.dropdownOpen2 = !this.dropdownOpen2;
    if (this.dropdownOpen2) {
      this.dropdownService.setOpenDropdown(this.index); // Уведомляем сервис, что открылся текущий селектор
    }
    event.stopPropagation(); // Останавливаем распространение клика
  }
  Option(option: any) {
    this.dropdownOpen2 = false;
  }
    
  selectLanguage(option: any) {
    this.selectedLanguage = option.value;
    this.dropdownOpen = false; // Закрываем селектор после выбора
    this.languageService.setLanguage(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
  }


  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.dropdownOpen1=false;
      this.dropdownOpen2=false;
      this.menuActive=false
    }
  }


    selectedOption: string = '';
  showSubMenu: boolean = false;

toggleSubMenu() {
    this.showSubMenu = !!this.selectedOption;
  }
  menuActive = false;
  
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}