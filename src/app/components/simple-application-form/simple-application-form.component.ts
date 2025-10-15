// src/app/components/simple-application-form/simple-application-form.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// import { NotificationService } from '../../services/notification.service';
import { ApplicationService } from '../../api/application.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-simple-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './simple-application-form.component.html',
  styleUrls: ['./simple-application-form.component.scss']
})
export class SimpleApplicationFormComponent {
  // 1. Принимаем URL для отправки от родителя
  @Input() apiUrl: string = '';
  @Input() formTitle: string = 'Оставить заявку';
  @Input() formSubtitle: string = 'Наш менеджер скоро свяжется с вами.';
  @Input() titleKey: string = 'forms.titles.default';
  @Input() subtitleKey: string = 'FORMS.SUBTITLES.DEFAULT';
  @Input() formType: 'acquiring' | 'salaryProject' | null = null;
  public applicationForm: FormGroup;
  public isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: ModalService,
    private applicationService: ApplicationService,
    private translate:TranslateService
  ) {
    this.applicationForm = this.fb.group({
      client_name: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

// ... (внутри вашего компонента)

onSubmit(): void {
  this.applicationForm.markAllAsTouched();
  if (this.applicationForm.invalid) {
    // --- НАЧАло ИЗМЕНЕНИЙ ---
    // Используем существующий ключ
    this.translate.get('notifications.fillAllFieldsWarning').subscribe((message: string) => {
      this.notificationService.show(message, 'error');
    });
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
    return;
  }
  
  if (!this.apiUrl) {
    // --- НАЧАло ИЗМЕНЕНИЙ ---
    // Это сообщение для разработчика, его можно не переводить,
    // но если хотите, можно создать ключ notifications.configError
    this.translate.get('notifications.configError').subscribe((message: string) => {
      this.notificationService.show(message, 'error');
    });
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
    return;
  }

  this.isSubmitting = true;
  const formData = this.applicationForm.value;

  this.applicationService.submitForm(this.apiUrl, formData).subscribe({
    next: () => {
      // --- НАЧАло ИЗМЕНЕНИЙ ---
      // Немного другой текст, нужен новый ключ
      this.translate.get('notifications.applicationSentSuccess').subscribe((message: string) => {
        this.notificationService.show(message, 'success');
      });
      // --- КОНЕЦ ИЗМЕНЕНИЙ ---
      this.applicationForm.reset();
      this.isSubmitting = false;
    },
    error: () => {
      // --- НАЧАло ИЗМЕНЕНИЙ ---
      // Используем существующий ключ
      this.translate.get('notifications.applicationErrorMessage').subscribe((message: string) => {
        this.notificationService.show(message, 'error');
      });
      // --- КОНЕЦ ИЗМЕНЕНИЙ ---
      this.isSubmitting = false;
    }
  });
}

  get client_name() { return this.applicationForm.get('client_name'); }
  get phone() { return this.applicationForm.get('phone'); }
}