import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  standalone: true,
  imports: [TranslateModule],
})
export class NotFoundComponent {
  private translate = inject(TranslateService);
  constructor() {
    if (localStorage.getItem('lang') != '') {
      this.translate.use(String(localStorage.getItem('lang')));
    }
  }
}
