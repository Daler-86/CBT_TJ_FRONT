import { Component, inject, OnInit } from '@angular/core';
// import { CarouselComponent } from '../carousel/carousel.component';
import {  CalculateComponent } from "../calculate/calculate.component";

import { CurrencyConverterComponent } from '../currency-converter/currency-converter.component';
import { TranslateModule} from '@ngx-translate/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';
import { FavriComponent } from "../favri/favri.component";
import { MenuService } from '../../api/menu.service';

import { environment } from '../../../environments/environment';
import { NewsBoxComponent } from '../news-box/news-box.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule, RouterLink, TranslateModule, CalculateComponent, CurrencyConverterComponent, FavriComponent, NewsBoxComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private menuService = inject(MenuService);
  ngOnInit(): void {
    this.loadMenu();
  }
  imageUrl: string = environment.IMAGE_URL;
  menus: Menu[] = [];
  loadMenu(): void {
    this.menuService.getMenu().subscribe(
      (response) => {
        this.menus = response.data.menus;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }
}
