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
import { OnlyDigitsDirective } from '../../shared/directives/only-digits.directive';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, YandexMapComponent, ReactiveFormsModule, OnlyDigitsDirective],
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
      client_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required]],
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
      const anchor = params['scrollTo'];
      if (anchor) {
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
    this.selectedSubjectName = subject.name;
    this.contactForm.get('contact_subject_id')?.setValue(subject.id);
    this.dropdownOpen = false;
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      const msg = this.translateService.instant('notifications.fillAllFieldsWarning');
      this.notificationService.show(msg, 'error');
      return;
    }

    this.isSubmitting = true;
    const formData: ContactFormPayload = this.contactForm.value;

    this.contactService.submitContactForm(formData).subscribe({
      next: () => {
        const successMsg = this.translateService.instant('notifications.messageSentSuccess');
        this.notificationService.show(successMsg, 'success');
        this.contactForm.reset();
        this.updateSubjectPlaceholder();
        this.isSubmitting = false;
      },
      error: () => {
        const errorMsg = this.translateService.instant('notifications.messageSentError');
        this.notificationService.show(errorMsg, 'error');
        this.isSubmitting = false;
      },
    });
  }

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
