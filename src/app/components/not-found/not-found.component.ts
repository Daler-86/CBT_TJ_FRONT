import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  
  constructor(private translate: TranslateService){
    if(localStorage.getItem('lang') != ''){
      this.translate.use(String(localStorage.getItem('lang')));
    }
  }

}
