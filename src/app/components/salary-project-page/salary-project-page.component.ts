import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-salary-project-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './salary-project-page.component.html',
  styleUrl: './salary-project-page.component.scss'
})
export class SalaryProjectPageComponent {

}
