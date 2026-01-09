import { Component, OnInit, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { VacanciesService } from '../../api/vacancies.service';
import {
  fileVacancyResponse,
  personalQuality,
  vacancyCondition,
  vacancyData,
  vacancyEducation,
  vacancyExperience,
  vacancySkill,
  vacancySubmit,
} from '../../models/vacancies.model';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';

import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { PageTitleService } from '../../services/page-title.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, TranslateModule, ScrollToDirective],
  templateUrl: './vacancy-detail.component.html',
  styleUrls: ['./vacancy-detail.component.scss'],
})
export class VacancyDetailComponent implements OnInit {
  applyForm: FormGroup;
  id = 0;
  // Переменная для хранения выбранного файла
  fileName = '';
  allowedExtensions = ['image/doc', 'image/jpeg', 'application/pdf'];
  personalQuality: personalQuality[] = [];
  condition: vacancyCondition[] = [];
  education: vacancyEducation[] = [];
  experience: vacancyExperience[] = [];
  skill: vacancySkill[] = [];
  // selectedFile: File | null = null;
  uploadFileId: number | null = null;
  isSubmitted = false;
  isError = false;
  vacancyData: vacancyData = {
    id: 0,
    name: '',
    region_name: '',
    deadline_at: '',
  };

  private pageTitleService = inject(PageTitleService);
  private fb = inject(FormBuilder);
  private vacanciesService = inject(VacanciesService);

  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(ModalService);
  private breadcrumbService = inject(BreadcrumbService);
  constructor() {
    this.applyForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s()-]*$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
      
      // Загружаем все данные
      this.loadAllData();

      // СЛУШАЕМ СМЕНУ ЯЗЫКА:
      // При смене языка нужно заново вызвать API, чтобы получить переведенное 'name'
      this.translate.onLangChange.subscribe(() => {
        this.loadAllData();
      });

    } else {
      console.error('ID is missing in the route parameters.');
    }

  }
  loadAllData() {
    this.vacanciesService.getPersonalQuality(this.id).subscribe(d => this.personalQuality = d.data.vacancy_personal_qualities);
    this.vacanciesService.getVacancyEducation(this.id).subscribe(d => this.education = d.data.vacancy_educations);
    this.vacanciesService.getVacancyExperience(this.id).subscribe(d => this.experience = d.data.vacancy_experiences);
    this.vacanciesService.getVacancyCondition(this.id).subscribe(d => this.condition = d.data.vacancy_conditions);
    this.vacanciesService.getVacancySkill(this.id).subscribe(d => this.skill = d.data.vacancy_skills);

    this.vacanciesService.getVacancyData(this.id).subscribe(
      (details) => {
        this.vacancyData = details.data.vacancy_data;
        if (this.vacancyData && this.vacancyData.name) {
          this.pageTitleService.setCustomTitle(this.vacancyData.name);
          this.breadcrumbService.setLabel(this.router.url, this.vacancyData.name);
        }
      },
      (error) => console.error('Ошибка при получении данных вакансии', error)
    );
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

  handleFile(file: File): void {
    if (this.isAllowedExtension(file.type)) {
      this.fileName = file.name;
    } else {
      console.error('Unsupported file type:', file.type);
    }
  }

  isAllowedExtension(fileType: string): boolean {
    return this.allowedExtensions.includes(fileType);
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        this.fileName = file.name;
        this.uploadFile(file);
      } else {
        this.notificationService.show('Неверный формат файла. Допустимы: PDF, DOC, DOCX.', 'error');
        
        input.value = '';
      }
    }
  }

  uploadFile(file: File) {
    this.vacanciesService.uploadFile(file).subscribe({
      next: (response: fileVacancyResponse) => {
        if (response.status === 'success') {
          this.uploadFileId = response.data.upload_file.id;
          this.notificationService.show('Файл успешно загружен.', 'success');
        }
      },
      error: (error) => {
        console.error('File upload failed:', error);
        this.fileName = ''; 
        this.notificationService.show('Не удалось загрузить файл.', 'error');
      },
    });
  }


  onSubmit() {
    this.applyForm.markAllAsTouched();

    if (this.applyForm.invalid) {

      this.translate.get('NOTIFICATIONS.FILL_ALL_REQUIRED_FIELDS_WARNING').subscribe((message: string) => {

        this.notificationService.show(message, 'error');
      });

      return;
    }
    if (this.uploadFileId === null) {
      this.translate.get('NOTIFICATIONS.UPLOAD_RESUME_WARNING').subscribe((message: string) => {

        this.notificationService.show(message, 'error');
      });
      return;
    }

    const formValue = this.applyForm.value;
    const formData: vacancySubmit = {
      last_name: formValue.lastName,
      first_name: formValue.firstName,
      email: formValue.email,
      phone: formValue.phone,
      upload_file_id: this.uploadFileId,
      vacancy_id: this.id,
    };

    this.vacanciesService.submitFormData(formData).subscribe({
      next: () => {

        this.translate.get('NOTIFICATIONS.APPLICATION_SENT_SUCCESS').subscribe((message: string) => {

          this.notificationService.show(message, 'success');
        });
   
        this.applyForm.reset();
        this.fileName = '';
        this.uploadFileId = null;
      },
      error: (error) => {
        console.error('Form submission failed:', error);

        this.translate.get('NOTIFICATION.APPLICATION_ERROR_MESSAGE').subscribe((message: string) => {

          this.notificationService.show(message, 'error');
        });
      },
    });
  } 
  get lastName() {
    return this.applyForm.get('lastName');
  }
  get firstName() {
    return this.applyForm.get('firstName');
  }
  get phone() {
    return this.applyForm.get('phone');
  }
  get email() {
    return this.applyForm.get('email');
  }
}
