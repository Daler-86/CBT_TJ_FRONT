// src/app/pages/contact/contact.component.ts

import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactService } from '../../api/contact.service';
import { ContactBlock, ContactFormPayload, ContactSubject } from '../../models/contact.model';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IMapPoint, YandexMapComponent } from '../yandex-map/yandex-map.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ScrollService } from '../../services/scroll.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, YandexMapComponent, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {
  contactBlocks: ContactBlock[] = [];

  imageUrl: string = environment.IMAGE_URL;

  zoom = 16;
  public headOfficePoint: IMapPoint[] = [];
  public selectedSubjectName = '';
  public dropdownOpen = false;
  subjects: ContactSubject[] = [];
  // Наша реактивная форма
  public contactForm!: FormGroup;
  public isSubmitting = false;
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);
  private notificationService = inject(ModalService);
  private scrollService = inject(ScrollService);
  private translateService = inject(TranslateService);

  private route = inject(ActivatedRoute);
  constructor() {
    this.contactForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/), // ✅ только цифры разрешены
        ],
      ],
      contact_subject_id: [null, [Validators.required]],
      question: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  private langChangeSubscription: Subscription | undefined;

  @ViewChild('customDropdown') dropdownRef!: ElementRef;
  ngOnInit(): void {
    this.contactService.getContacts().subscribe((res) => {
      this.contactBlocks = res.data.contacts;
      this.subjects = res.data.subjects;
    });
    this.updateSubjectPlaceholder();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateSubjectPlaceholder();
    });

    this.route.queryParams.subscribe((params) => {
      const anchor = params['scrollTo']; // Ищем параметр 'scrollTo' в URL
      if (anchor) {
        // Если параметр есть, вызываем наш сервис
        this.scrollService.scrollToAnchor(anchor);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
  updateSubjectPlaceholder(): void {
    if (!this.contactForm.get('contact_subject_id')?.value) {
      this.translateService.get('FORMS.PLACEHOLDERS.SELECT_SUBJECT').subscribe((translation) => {
        this.selectedSubjectName = translation;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.dropdownOpen && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  selectSubject(subject: ContactSubject): void {
    this.selectedSubjectName = subject.name; // Имя для отображения
    this.contactForm.get('contact_subject_id')?.setValue(subject.id); // ID для отправки
    this.dropdownOpen = false;
  }

  // --- Метод отправки формы ---
  // ... (внутри вашего компонента)

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      // --- НАЧАЛО ИЗМЕНЕНИЙ ---
      this.translateService.get('notifications.fillAllFieldsWarning').subscribe((message: string) => {
        this.notificationService.show(message, 'error');
      });
      // --- КОНЕЦ ИЗМЕНЕНИЙ ---
      return;
    }

    this.isSubmitting = true;
    const formData: ContactFormPayload = this.contactForm.value;

    this.contactService.submitContactForm(formData).subscribe({
      next: () => {
        // --- НАЧАЛО ИЗМЕНЕНИЙ ---
        this.translateService.get('notifications.messageSentSuccess').subscribe((message: string) => {
          this.notificationService.show(message, 'success');
        });
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---
        this.contactForm.reset();
        this.updateSubjectPlaceholder();
        this.isSubmitting = false;
      },
      error: () => {
        // --- НАЧАЛО ИЗМЕНЕНИЙ ---
        this.translateService.get('notifications.messageSentError').subscribe((message: string) => {
          this.notificationService.show(message, 'error');
        });
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---
        this.isSubmitting = false;
      },
    });
  }

  // Геттеры для удобной валидации в HTML
  get client_name() {
    return this.contactForm.get('client_name');
  }
  get phone() {
    return this.contactForm.get('phone');
  }
  get contact_subject_id() {
    return this.contactForm.get('contact_subject_id');
  }
  get question() {
    return this.contactForm.get('question');
  }
}
