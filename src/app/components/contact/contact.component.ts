// src/app/pages/contact/contact.component.ts

import { Component, OnInit, ElementRef, ViewChild , HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GoogleMapsModule } from '@angular/google-maps'; // Убедись, что импорт есть
import { ContactService } from '../../api/contact.service';
import { ContactBlock, ContactFormPayload, ContactPayload, ContactSubject } from '../../models/contact.model';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IMapPoint, YandexMapComponent } from '../yandex-map/yandex-map.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { ScrollService } from '../../services/scroll.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, YandexMapComponent, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactBlocks: ContactBlock[] = [];
 
  imageUrl: string = environment.IMAGE_URL;

  zoom = 16;
  public headOfficePoint: IMapPoint[] = [];
  public selectedSubjectName: string = '';
  public dropdownOpen: boolean = false;
  subjects: ContactSubject[] = []
  // Наша реактивная форма
  public contactForm!: FormGroup;
  public isSubmitting: boolean = false;


  constructor(private contactService: ContactService,
    private fb: FormBuilder,
    private notificationService: ModalService,
    private scrollService: ScrollService,
    private translateService: TranslateService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    ) {

      this.contactForm = this.fb.group({
        client_name: ['', [Validators.required, Validators.minLength(2)]],
        phone: ['', [Validators.required]],
        contact_subject_id: [null, [Validators.required]],
        question: ['', [Validators.required, Validators.minLength(10)]]
      });
    }
    private langChangeSubscription: Subscription | undefined;

    
  @ViewChild('customDropdown') dropdownRef!: ElementRef;
  ngOnInit(): void {
    this.contactService.getContacts().subscribe(res => {
      this.contactBlocks = res.data.contacts;
      this.subjects=res.data.subjects
      
  
    });
    this.updateSubjectPlaceholder();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateSubjectPlaceholder();
    });


    this.createHeadOfficeMapPoint();
    this.route.queryParams.subscribe(params => {
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
      this.translateService.get('forms.placeholders.selectSubject').subscribe(translation => {
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

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      this.notificationService.show('Пожалуйста, заполните все поля.', 'error');
      return;
    }

    this.isSubmitting = true;
    const formData: ContactFormPayload = this.contactForm.value;

    this.contactService.submitContactForm(formData).subscribe({
      next: (response) => {
        this.notificationService.show('Ваше сообщение успешно отправлено!', 'success');
        this.contactForm.reset();
        this.updateSubjectPlaceholder(); // Восстанавливаем плейсхолдер
        this.isSubmitting = false;
      },
      error: (error) => {
        this.notificationService.show('Не удалось отправить сообщение. Попробуйте позже.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  // Геттеры для удобной валидации в HTML
  get client_name() { return this.contactForm.get('client_name'); }
  get phone() { return this.contactForm.get('phone'); }
  get contact_subject_id() { return this.contactForm.get('contact_subject_id'); }
  get question() { return this.contactForm.get('question'); }
  private createHeadOfficeMapPoint(): void {
    // Здесь вы можете взять данные из вашего API или задать их статически
    const headOfficeData = {
      id: 1,
      name: 'Головной офис CBT Банк',
      address: 'г. Душанбе, проспект Рудаки, 105',
      // Точные координаты вашего головного офиса
      latitude: '38.575678', 
      longitude: '68.782045'
    };
    
   
  
  }
 

}