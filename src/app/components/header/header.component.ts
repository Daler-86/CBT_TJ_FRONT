import { Component ,HostListener, ElementRef, OnInit} from '@angular/core';

import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

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
  dropdownOpen1 = false;
  dropdownOpen2 = false;
  constructor(private elementRef: ElementRef, private dropdownService: DropdownService, private translateService: TranslateService, private languageService: LanguagesService,private router: Router) {
    // Задаем уникальный индекс для каждого селектора (например, можно использовать случайное число или индекс из родительского компонента)
    this.index = Math.floor(Math.random() * 10000); // Уникальный идентификатор для селектора
  }
  options = [
    { value: '1', label: 'Карты',route:"/cards"},
    { value: '2', label: 'Кредиты',route:"/credit" },
    { value: '3', label: 'Вклады' ,route:""},
    { value: '4', label: 'Переводы',route:"" },
    { value: '5', label: 'Автокредит',route:"" },
    { value: '6', label: 'Страхование',route:"" },
    { value: '7', label: 'Курсы валют',route:"" }
  ];

  Options = [
    { value: '1', label: 'Новости', route:""},
    { value: '2', label: 'Тендеры',route:"/business" },
    { value: '3', label: 'Вакансии', route:"/vacancies"}
  ];
  selectedOption: string = '';
  showSubMenu: boolean = false;
 menuActive = false;
  ngOnInit() {}

  // Открытие/закрытие первого селекта
  toggleDropdown1(event: Event) {
    this.dropdownOpen1 = true;
    event.stopPropagation(); // Останавливаем распространение события
  }

  closeDropdown1() {
    this.dropdownOpen1 = false;
  }

  // Открытие/закрытие второго селекта
  toggleDropdown2(event: Event) {
    this.dropdownOpen2 = true;
    event.stopPropagation(); // Останавливаем распространение события
  }

  closeDropdown2() {
    this.dropdownOpen2 = false;
  }

  selectOption(option: any, event: Event) {
    event.stopPropagation();
    this.dropdownOpen1 = false;
    this.router.navigate([option.route]);
  }
  
  Option(option: any, event: Event) {
    console.log(1111)
    event.stopPropagation();
    this.dropdownOpen2 = false;
    this.router.navigate([option.route]);
  }


  dropdownOpen = false; // Локальное состояние компонента
  selectedLanguage: string = '1';// Выбранный язык для селектора
  index: number; // Индекс текущего селектора (уникальный для каждого селектора)

  languageOptions = [
    { value: '1', label: 'Тоҷикӣ' },
    { value: '2', label: 'Русский' },
    { value: '3', label: 'English' }
  ];

  toggleDropdown(event: Event) {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.dropdownService.setOpenDropdown(this.index); // Уведомляем сервис, что открылся текущий селектор
    }
    event.stopPropagation(); // Останавливаем распространение клика
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

toggleSubMenu() {
    this.showSubMenu = !!this.selectedOption;
    this.menuActive=false
  }
 
  
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}