import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transfers-details',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './transfers-details.component.html',
  styleUrl: './transfers-details.component.scss'
})
export class TransfersDetailsComponent {

}
