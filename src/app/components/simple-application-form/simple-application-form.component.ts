import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ApplicationService } from '../../api/application.service';
import { ModalService } from '../../services/modal.service';
import { OnlyDigitsDirective } from '../../shared/directives/only-digits.directive';

@Component({
  selector: 'app-simple-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, OnlyDigitsDirective],
  templateUrl: './simple-application-form.component.html',
  styleUrls: ['./simple-application-form.component.scss'],
})
export class SimpleApplicationFormComponent {
  @Input() apiUrl = '';
  @Input() formTitle = 'Оставить заявку';
  @Input() formSubtitle = 'Наш менеджер скоро свяжется с вами.';
  @Input() titleKey = 'forms.titles.default';
  @Input() subtitleKey = 'FORMS.SUBTITLES.DEFAULT';
  @Input() formType: 'acquiring' | 'salaryProject' | null = null;
  public applicationForm: FormGroup;
  public isSubmitting = false;
  private fb = inject(FormBuilder);
  private notificationService = inject(ModalService);
  private applicationService = inject(ApplicationService);
  private translate = inject(TranslateService);
  constructor() {
    this.applicationForm = this.fb.group({
      client_name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.applicationForm.markAllAsTouched();
    if (this.applicationForm.invalid) {
      const msg = this.translate.instant('NOTIFICATIONS.FILL_ALL_FIELDS_WARNING');
      this.notificationService.show(msg, 'error');

      return;
    }

    if (!this.apiUrl) {
      const msg = this.translate.instant('NOTIFICATIONS.CONFIG_ERROR');
      this.notificationService.show(msg, 'error');
      return;
    }

    this.isSubmitting = true;
    const formData = this.applicationForm.value;

    this.applicationService.submitForm(this.apiUrl, formData).subscribe({
      next: () => {
        const msg = this.translate.instant('NOTIFICATIONS.APPLICATION_SUCCESS_MESSAGE');
        this.notificationService.show(msg, 'success');
        this.applicationForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        const msg = this.translate.instant('NOTIFICATIONS.APPLICATION_ERROR_MESSAGE');
        this.notificationService.show(msg, 'error');
        this.isSubmitting = false;
      },
    });
  }

  get client_name() {
    return this.applicationForm.get('client_name');
  }
  get phone() {
    return this.applicationForm.get('phone');
  }
}
