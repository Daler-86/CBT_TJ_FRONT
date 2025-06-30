import { Component } from '@angular/core';
import { NewsBoxComponent } from "../news-box/news-box.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NewsBoxComponent, TranslateModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
