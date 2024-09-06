import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { Vacancy, VacancyService } from '../../services/vacancy.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLinkActive, RouterModule,ReactiveFormsModule],
  templateUrl: './vacancy-detail.component.html',
  styleUrls: ['./vacancy-detail.component.scss']
})

export class VacancyDetailComponent implements OnInit {
  applyForm: FormGroup;
  vacancy: Vacancy | null = null;
  selectedFile: File | null = null;  // Переменная для хранения выбранного файла
  fileName: string = '';
  allowedExtensions = ['image/doc', 'image/jpeg', 'application/pdf'];

  constructor(private fb: FormBuilder,private vacancyService: VacancyService,    private route: ActivatedRoute) {
    this.applyForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      phone: [''],
      email: ['']
    });
  }
  ngOnInit(): void {
    // Извлечение ID из параметров маршрута
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Загрузка вакансии по ID
      const vacancy = this.vacancyService.getVacancyById(id);
      if (vacancy) {
        this.vacancy = vacancy;
      } else {
        console.error('Vacancy not found');
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
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
      this.selectedFile = file;
      this.fileName = file.name;
      console.log('Selected file:', file);
    } else {
      console.error('Unsupported file type:', file.type);
    }
  }

  isAllowedExtension(fileType: string): boolean {
    return this.allowedExtensions.includes(fileType);
  }

  onSubmit(): void {
    if (this.applyForm.valid && this.selectedFile) {
      const formData = new FormData();
      
      const lastName = this.applyForm.get('lastName')?.value || '';
      const firstName = this.applyForm.get('firstName')?.value || '';
      const phone = this.applyForm.get('phone')?.value || '';
      const email = this.applyForm.get('email')?.value || '';
  
      formData.append('lastName', lastName);
      formData.append('firstName', firstName);
      formData.append('phone', phone);
      formData.append('email', email);
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      // Проверяем содержимое formData с помощью forEach
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      // Пример отправки данных
      // this.yourService.submitForm(formData).subscribe(response => {
      //   console.log('Ответ сервера:', response);
      // });
    } else {
      console.log('Форма невалидна или файл не выбран');
      this.applyForm.markAllAsTouched();
    }
  }
  
}