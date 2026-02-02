import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { ScrollService } from '../../services/scroll.service';
import { CardPromoComponent } from './components/card-promo/card-promo.component';
import { CardFeaturesComponent } from './components/card-features/card-features.component';
import { CardTariffsComponent } from './components/card-tariffs/card-tariffs.component';
import { CardApplicationComponent } from './components/card-application/card-application.component';
import { CardFaqComponent } from './components/card-faq/card-faq.component';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    CardPromoComponent,
    CardFeaturesComponent,
    CardTariffsComponent,
    CardApplicationComponent,
    CardFaqComponent,
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent implements OnInit, OnDestroy {
  imageUrl: string = environment.IMAGE_URL;
  cardId = 0;

  private langChangeSubscription: Subscription | undefined;
  private route = inject(ActivatedRoute);
  private scrollService = inject(ScrollService);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.cardId = +idParam;
    }

    this.route.queryParams.subscribe((params) => {
      const anchor = params['scrollTo'];
      if (anchor) {
        this.scrollService.scrollToAnchor(anchor);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
