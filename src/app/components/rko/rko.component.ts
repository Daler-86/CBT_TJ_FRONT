import { Component } from '@angular/core';
import { RkoService } from '../../api/rko.service';
import { MenuService } from '../../api/menu.service';
import { environment } from '../../../environments/environment';
import { scs } from '../../models/rko.model';
import {CommonModule} from '@angular/common';

import {RouterLink, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-rko',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, CommonModule],
  templateUrl: './rko.component.html',
  styleUrl: './rko.component.scss'
})
export class RkoComponent {

 imageUrl: string = environment.IMAGE_URL;
  personTypeId: number = 1;

  constructor(private rkoService: RkoService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    this.menuService.currentPersonTypeId.subscribe(id => {
      this.personTypeId = id;
      this.loadAllTransfers(); // Загрузка всех карт по умолчанию
    });
  }

  rkoList: scs[] =[] 

  loadAllTransfers() {

    this.rkoService.getRKOListAll().subscribe(
      (response) => {
        this.rkoList = response.data.scss;

      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      }
    );
  }
}
