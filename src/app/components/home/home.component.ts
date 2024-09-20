import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import {  CalculateComponent } from "../calculate/calculate.component";
import { NgFor } from '@angular/common';
import { CurrencyConverterComponent } from '../currency-converter/currency-converter.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CardsComponent } from '../cards/cards.component';

interface News{
  image:string;
  date:string;
  title:string;
  content:string;
}

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [RouterModule,RouterLink, CarouselComponent,TranslateModule ,CalculateComponent,CurrencyConverterComponent ,NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
news:News[]=[
  {
    image:"../../assets/icons/image 1.png",
    date:"29 декабря 2023",
    title:"Итоги 2023 года",
    content:"Спасибо каждому из них и всему колле ктиву за их неутомимость.."

  },
  {
    image:"../../assets/icons/image 2.png",
    date:"28 ноября 2023",
    title:"Фестиваль финансовой...",
    content:"26.10.2023 года в городе Худжанде прошел Фестиваль финансовой..."

  },
  {
    image:"../../assets/icons/image 3.png",
    date:"28 сентября 2023",
    title:"Открытие ЦБО в г. Душанбе ",
    content:"Мы стремимся быть ближе к Вам, и спешим сообщить об открытии.."

  },


  
]

}
