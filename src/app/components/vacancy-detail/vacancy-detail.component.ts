import { Component, OnInit , ViewChild, ElementRef, inject} from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { VacanciesService } from '../../api/vacancies.service';
import { personalQuality, vacancyCondition, vacancyEducation, vacancyExperience, vacancySkill } from '../../models/vacancies.model';

import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';

import { ScrollToDirective } from '../../directives/scroll-to.directive';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [NgIf, NgFor,  RouterModule,ReactiveFormsModule, TranslateModule, ScrollToDirective],
  templateUrl: './vacancy-detail.component.html',
  styleUrls: ['./vacancy-detail.component.scss']
})

export class VacancyDetailComponent implements OnInit {
  applyForm: FormGroup;
  id:number=0
 // Переменная для хранения выбранного файла
  fileName: string = '';
  allowedExtensions = ['image/doc', 'image/jpeg', 'application/pdf'];
   personalQuality:personalQuality[]=[]
   condition:vacancyCondition[]=[]
  education:vacancyEducation[]=[]
  experience:vacancyExperience[]=[]
  skill:vacancySkill[]=[]
  // selectedFile: File | null = null;
  uploadFileId: number | null = null;
  isSubmitted: boolean = false;
  isError:boolean=false
  vacancyData:any={}
  
  private pageTitleService = inject(PageTitleService);
  constructor(private fb: FormBuilder,private vacanciesService: VacanciesService,    private route: ActivatedRoute, private notificationService:ModalService) {
    this.applyForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s()-]*$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id= +idParam; 
    } else {
      console.error('ID is missing in the route parameters.');
    }
       this.vacanciesService.getPersonalQuality(this.id).subscribe(
      (details) => {
        this.personalQuality=details.data.vacancy_personal_qualities;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );

    this.vacanciesService.getVacancyEducation(this.id).subscribe(
      (details) => {
        this.education=details.data.vacancy_educations;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );

    this.vacanciesService.getVacancyExperience(this.id).subscribe(
      (details) => {
        this.experience=details.data.vacancy_experiences;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
    this.vacanciesService.getVacancyCondition(this.id).subscribe(
      (details) => {
        this.condition=details.data.vacancy_conditions;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );

    this.vacanciesService.getVacancySkill(this.id).subscribe(
      (details) => {
        this.skill=details.data.vacancy_skills;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
    this.vacanciesService.getVacancyData(this.id).subscribe(
      (details) => {
        this.vacancyData=details.data.vacancy_data
        if (this.vacancyData && this.vacancyData.name) {
          // ...передаем уже готовое, переведенное название в сервис заголовков.
          this.pageTitleService.setCustomTitle(this.vacancyData.name);
        }
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
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
    element.classList.add('dragover'); // Добавляем класс для визуального эффекта
  }

  onDragLeave(event: DragEvent): void {
    const element = event.target as HTMLElement;
    element.classList.remove('dragover'); // Убираем класс при покидании зоны
  }

  handleFile(file: File): void {
    if (this.isAllowedExtension(file.type)) {
      // this.selectedFile = file;
      this.fileName = file.name;
      // console.log('Selected file:', file);
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
      // Проверяем расширение перед загрузкой
      if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        this.fileName = file.name;
        this.uploadFile(file);
      } else {
        this.notificationService.show('Неверный формат файла. Допустимы: PDF, DOC, DOCX.', 'error');
        // Очищаем input, чтобы можно было выбрать тот же файл еще раз
        input.value = '';
      }
    }
  }

  uploadFile(file: File) {
    this.vacanciesService.uploadFile(file).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.uploadFileId = response.data.upload_file.id;
          this.notificationService.show('Файл успешно загружен.', 'success');
        }
      },
      error: (error) => {
        console.error('File upload failed:', error);
        this.fileName = ''; // Сбрасываем имя файла при ошибке
        this.notificationService.show('Не удалось загрузить файл.', 'error');
      }
    });
  }

  onSubmit() {
    this.applyForm.markAllAsTouched(); // Помечаем все поля как "тронутые" для показа ошибок

    if (this.applyForm.invalid) {
      this.notificationService.show('Пожалуйста, заполните все обязательные поля.', 'error');
      return;
    }
    if (this.uploadFileId === null) {
      this.notificationService.show('Пожалуйста, загрузите ваше резюме.', 'error');
      return;
    }

    const formData = {
      ...this.applyForm.value,
      upload_file_id: this.uploadFileId,
      vacancy_id: this.id // Используем ID текущей вакансии
    };

    this.vacanciesService.submitFormData(formData).subscribe({
      next: (response) => {
        // console.log('Form submitted successfully:', response);
        // Показываем уведомление об успехе
        this.notificationService.show('Ваша заявка успешно отправлена!', 'success');
        
        // Очищаем форму и сбрасываем состояние файла
        this.applyForm.reset();
        this.fileName = '';
        this.uploadFileId = null;
      },
      error: (error) => {
        console.error('Form submission failed:', error);
        // Показываем уведомление об ошибке
        this.notificationService.show('Не удалось отправить заявку. Попробуйте позже.', 'error');
      }
    });
  }
  
  // Геттеры для удобного доступа к контролам в шаблоне
  get lastName() { return this.applyForm.get('lastName'); }
  get firstName() { return this.applyForm.get('firstName'); }
  get phone() { return this.applyForm.get('phone'); }
  get email() { return this.applyForm.get('email'); }
  
}