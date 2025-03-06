import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-deposits',
  standalone: true,
  imports:[RouterLink, RouterModule, TranslateModule, NgIf, NgFor,CommonModule],
  templateUrl: './deposits.component.html',
  styleUrl: './deposits.component.scss'
})
export class DepositsComponent {

}
