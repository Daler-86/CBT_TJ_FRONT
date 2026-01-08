import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransfersService } from '../../api/transfer.service';
import { MenuService } from '../../api/menu.service';
import { Transfer } from '../../models/transfers.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.scss',
})
export class TransfersComponent implements OnInit {
  imageUrl: string = environment.IMAGE_URL;
  personTypeId = 1;
  private transfersService = inject(TransfersService);
  private menuService = inject(MenuService);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.menuService.currentPersonTypeId.subscribe((id) => {
      this.personTypeId = id;
      this.loadAllTransfers();
    });
  }

  transfersList: Transfer[] = [];

  loadAllTransfers() {
    this.transfersService.getTransfersListAll().subscribe(
      (response) => {
        this.transfersList = response.data.transfers;
      },
      (error) => {
        console.error('Ошибка при загрузке всех карт', error);
      },
    );
  }
}
