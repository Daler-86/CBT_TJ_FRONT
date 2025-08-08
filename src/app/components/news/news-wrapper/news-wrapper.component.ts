import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-news-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './news-wrapper.component.html',
  styleUrl: './news-wrapper.component.scss'
})
export class NewsWrapperComponent {

}
