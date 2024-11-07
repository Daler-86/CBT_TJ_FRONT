import { Component, ElementRef } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import {  CalculateComponent } from "../calculate/calculate.component";
import { NgFor, NgIf } from '@angular/common';
import { CurrencyConverterComponent } from '../currency-converter/currency-converter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';
import { FavriComponent } from "../favri/favri.component";
import { MenuService } from '../../api/menu.service';
import { HttpClient } from '@angular/common/http';
import { LanguagesService } from '../../languages.service';

interface News{
  image:string;
  date:string;
  title:string;
  content:string;
}

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule, RouterLink, CarouselComponent, TranslateModule, CalculateComponent, CurrencyConverterComponent, NgFor, FavriComponent,NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private http: HttpClient,
    private menuService:MenuService,
 
    private languageService: LanguagesService,
    private translateService: TranslateService
  ) {

  }
  ngOnInit(): void {
    this.loadMenu();
  }
  menus: any[] = [];
  loadMenu(): void {
    this.menuService.getMenu().subscribe(
      (response) => {
        this.menus = response.data.menus;
        console.log(this.menus)
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }
}
