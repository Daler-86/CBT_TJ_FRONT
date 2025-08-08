import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vacancy-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './vacancy-wrapper.component.html',
  styleUrl: './vacancy-wrapper.component.scss'
})
export class VacancyWrapperComponent {

}
