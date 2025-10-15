import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../api/menu.service';
import { mainGalleries } from '../../models/menu.model';
import {environment} from "../../../environments/environment";
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-carousel',
  imports:[CommonModule,TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone:true,
})


export class CarouselComponent {
  // slides: Slide[] = [
  //   {
  //     title: 'Автокредит на новое авто от 150 000с.',
  //     description: 'Мечтаете приобрести автомобиль? Теперь покупка автомобиля стала еще выгоднее!',
  //     image: '../../assets/icons/foto1.png'
  //   },
  //   {
  //     title: 'Автокредит на новое авто от 150 000с.',
  //     description: 'Мечтаете приобрести автомобиль? Теперь покупка автомобиля стала еще выгоднее!',
  //     image: '../../assets/icons/logo.png'
  //   },
  // ];
  galleries:mainGalleries[]=[]
  imageUrl: string = environment.IMAGE_URL;
  constructor(private menuService:MenuService,private router:Router){}
  ngOnInit():void{
    this.menuService.getMainGalleries().subscribe(
      (response) => {
        this.galleries = response.data.main_galleries;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }

  currentSlide: number = 0;

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.galleries.length) % this.galleries.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.galleries.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onLearnMore(route:string): void {
    this.router.navigate([route], { queryParams: { scrollToForm: true } });
  
    // console.log('Подробнее нажато');
  }
}

