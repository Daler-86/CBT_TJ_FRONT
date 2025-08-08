import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vacancy-list-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './vacancy-list-wrapper.component.html',
  styleUrl: './vacancy-list-wrapper.component.scss'
})
export class VacancyListWrapperComponent {

}
