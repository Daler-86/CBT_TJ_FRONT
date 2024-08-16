import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-carousel',
  imports:[NgFor,TranslateModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone:true,
})


export class CarouselComponent {
  slides: Slide[] = [
    {
      title: 'Автокредит на новое авто от 150 000с.',
      description: 'Мечтаете приобрести автомобиль? Теперь покупка автомобиля стала еще выгоднее!',
      image: '../../assets/icons/foto1.png'
    },
    {
      title: 'Автокредит на новое авто от 150 000с.',
      description: 'Мечтаете приобрести автомобиль? Теперь покупка автомобиля стала еще выгоднее!',
      image: '../../assets/icons/logo.png'
    },
    
  ];

  currentSlide: number = 0;

  getTransform(): string {
    return `translateX(-${this.currentSlide * 100}%)`;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  onLearnMore(): void {
    // Реализуйте функциональность для кнопки "Подробнее"
    console.log('Подробнее нажато');
  }
}

