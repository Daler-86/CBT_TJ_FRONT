// src/app/components/simple-application-form/simple-application-form.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
  @Input() subtitleKey: string = 'forms.subtitles.default';
  @Input() formType: 'acquiring' | 'salaryProject' | null = null;
  public applicationForm: FormGroup;
  public isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: ModalService,
    private applicationService: ApplicationService
  ) {
    this.applicationForm = this.fb.group({
      client_name: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.applicationForm.markAllAsTouched();
    if (this.applicationForm.invalid) {
      this.notificationService.show('Пожалуйста, заполните все поля.', 'error');
      return;
    }
    // Проверяем, что URL был передан
    if (!this.apiUrl) {
      this.notificationService.show('Ошибка конфигурации: не указан URL для отправки.', 'error');
      return;
    }

    this.isSubmitting = true;
    const formData = this.applicationForm.value;

    this.applicationService.submitForm(this.apiUrl, formData).subscribe({
      next: () => {
        this.notificationService.show('Ваша заявка успешно отправлена!', 'success');
        this.applicationForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.notificationService.show('Не удалось отправить заявку. Попробуйте позже.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  get client_name() { return this.applicationForm.get('client_name'); }
  get phone() { return this.applicationForm.get('phone'); }
}