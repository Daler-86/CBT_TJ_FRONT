import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  private breadcrumbService = inject(BreadcrumbService);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbService.breadcrumbs$;
}
