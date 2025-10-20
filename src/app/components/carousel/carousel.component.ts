import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../api/menu.service';
import { mainGalleries } from '../../models/menu.model';
import { environment } from '../../../environments/environment';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-carousel',
  imports: [NgFor, NgIf, TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
})
export class CarouselComponent implements OnInit {
  galleries: mainGalleries[] = [];
  imageUrl: string = environment.IMAGE_URL;
  private menuService = inject(MenuService);
  private router = inject(Router);
  ngOnInit(): void {
    this.menuService.getMainGalleries().subscribe(
      (response) => {
        this.galleries = response.data.main_galleries;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }

  currentSlide = 0;

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

  onLearnMore(route: string): void {
    this.router.navigate([route], { queryParams: { scrollToForm: true } });

    // console.log('Подробнее нажато');
  }
}
