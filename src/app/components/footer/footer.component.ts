import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, RouterModule, RouterLink, ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear()
}
