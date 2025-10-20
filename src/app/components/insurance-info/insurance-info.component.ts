// src/app/pages/insurance-info/insurance-info.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactBlock } from '../../models/contact.model';
import { environment } from '../../../environments/environment';
import { ContactService } from '../../api/contact.service';

@Component({
  selector: 'app-insurance-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './insurance-info.component.html',
  styleUrls: ['./insurance-info.component.scss'],
})
export class InsuranceInfoComponent implements OnInit {
  // --- Логика для Аккордеона ---
  public activeAccordion: string | null = null;
  contactBlocks: ContactBlock[] = [];
  imageUrl: string = environment.IMAGE_URL;
  // --- Логика для Степпера/Слайдера ---
  public slides: { title: string; content: string }[] = [];
  public currentSlideIndex = 0;
  ngOnInit(): void {
    this.contactService.getContacts().subscribe((res) => {
      this.contactBlocks = res.data.contacts;
    });
  }
  private translate = inject(TranslateService);
  private contactService = inject(ContactService);
  constructor() {
    // Загружаем слайды из файла перевода, чтобы знать их количество
    this.translate
      .get('insurancePage.forDepositors.slides')
      .subscribe((translatedSlides: { title: string; content: string }[]) => {
        this.slides = translatedSlides;
      });
  }

  // --- Методы для Аккордеона ---
  toggleAccordion(section: string): void {
    this.activeAccordion = this.activeAccordion === section ? null : section;
  }

  // --- Методы для Степпера/Слайдера ---
  nextSlide(): void {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
