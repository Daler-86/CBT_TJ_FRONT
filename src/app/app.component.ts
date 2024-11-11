import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { transition } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent,FooterComponent, RouterOutlet,TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})


export class AppComponent {
   constructor(private translate: TranslateService) {
   
    
  }
ngOnInit():void{
let savedLanguage = localStorage.getItem('appLanguage');
   if(savedLanguage){
      this.translate.setDefaultLang(savedLanguage);
    }
    else{
       this.translate.setDefaultLang('1');
      this.translate.use('1');
    }
}
  
}
