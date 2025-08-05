import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleApplicationFormComponent } from "../simple-application-form/simple-application-form.component";

@Component({
  selector: 'app-salary-project-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, SimpleApplicationFormComponent],
  templateUrl: './salary-project-page.component.html',
  styleUrl: './salary-project-page.component.scss'
})
export class SalaryProjectPageComponent {
  public readonly salaryApiUrl = '/order/salary/save';
}
