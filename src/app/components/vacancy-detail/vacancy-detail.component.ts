import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { Vacancy, VacancyService } from '../../services/vacancy.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { VacanciesService } from '../../api/vacancies.service';
import { personalQuality, vacancyCondition, vacancyEducation, vacancyExperience, vacancySkill } from '../../models/vacancies.model';
import { forkJoin } from 'rxjs'; // Импортируем forkJoin

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLinkActive, RouterModule,ReactiveFormsModule],
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
  selectedFile: File | null = null;
  uploadFileId: number | null = null;
  isSubmitted: boolean = false;
  isError:boolean=false
  constructor(private fb: FormBuilder,private vacanciesService: VacanciesService,    private route: ActivatedRoute) {
    this.applyForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      phone: [''],
      email: ['']
    });
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id= +idParam; 
      console.log(this.id)
       // Преобразование строки в число
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
      console.log('Selected file:', file);
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
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      this.uploadFile(); // Сразу загружаем файл после его выбора
    }
  }
 uploadFile() {
    if (this.selectedFile) {
      this.vacanciesService.uploadFile(this.selectedFile)
        .subscribe(
          (response: any) => {
            if (response.status === 'success') {
              this.uploadFileId = response.data.upload_file.id; // Сохраняем ID загруженного файла
              console.log('File uploaded successfully:', response);
            }
          },
          (error) => {
            console.error('File upload failed:', error);
          }
        );
    }
  }

  onSubmit() {
    if (this.applyForm.valid && this.uploadFileId !== null) {
      const formData = {
        email: this.applyForm.value.email,
        first_name: this.applyForm.value.firstName,
        last_name: this.applyForm.value.lastName,
        phone: this.applyForm.value.phone,
        upload_file_id: this.uploadFileId,
        vacancy_id: 123 // Здесь укажите нужный ID вакансии
      };

      this.vacanciesService.submitFormData(formData)
      .subscribe(
        (response) => {
          console.log('Form submitted successfully:', response);
          this.applyForm.reset(); // Очистка формы после успешной отправки
          this.selectedFile = null; // Сбросить выбранный файл
          this.fileName = ''; // Сбросить имя файла
          this.uploadFileId = null; // Сбросить ID загруженного файла
          this.isSubmitted = true; // Показать сообщение об успешной отправке

          setTimeout(() => {
            this.isSubmitted = false; // Скрыть сообщение через 30 секунд
          }, 30000);
        },
        (error) => {
          console.error('Form submission failed:', error);
          this.isError = true; // Показать сообщение об ошибке

          setTimeout(() => {
            this.isError = false; // Скрыть сообщение через 30 секунд
          }, 30000);
        }
      );
       
    } else {
      console.warn('Form is not valid or file is not uploaded');
    }
  }
  
}