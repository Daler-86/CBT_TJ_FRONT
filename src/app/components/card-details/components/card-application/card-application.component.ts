import { Component, Input, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardsService } from '../../../../api/cards.service';
import { RegionService } from '../../../../api/region.service';
import { ModalService } from '../../../../services/modal.service';
import { officeList } from '../../../../models/region.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-application',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './card-application.component.html',
  styleUrl: './card-application.component.scss',
})
export class CardApplicationComponent implements OnInit, OnDestroy {
  cardId = 0;
  offices: officeList[] = [];
  dropdownOpen = false;
  officeName = '';

  private langChangeSubscription: Subscription | undefined;
  public applicationForm: FormGroup;

  private regionService = inject(RegionService);
  private cardsService = inject(CardsService);
  private notificationService = inject(ModalService);
  private translateService = inject(TranslateService);
  private fb = inject(FormBuilder);

  @ViewChild('customDropdown') dropdownRef!: ElementRef;

  constructor() {
    this.applicationForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9\\s()-]*$')]],
      office_id: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadOffice();
    this.setupLanguageChangeListener();
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private setupLanguageChangeListener(): void {
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateOfficePlaceholder();
    });
    this.translateService.get('FORMS.PLACEHOLDERS.SELECT_OFFICE').subscribe((translation) => {
      this.officeName = translation;
    });
  }

  private loadOffice(): void {
    this.regionService.getOfficeList().subscribe(
      (response) => {
        this.offices = response.data.offices;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      },
    );
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  selectOption(item: officeList): void {
    this.officeName = item.name;
    this.applicationForm.get('office_id')?.setValue(item.id);
    this.dropdownOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  submitApplication(): void {
    this.applicationForm.markAllAsTouched();

    if (this.applicationForm.invalid) {
      this.notificationService.show('Пожалуйста, заполните все поля корректно.', 'error');
      return;
    }

    const dataToSend = {
      card_id: this.cardId,
      ...this.applicationForm.value,
    };

    this.cardsService.submitCardByBrand(dataToSend).subscribe({
      next: () => {
        this.translateService.get('NOTIFICATIONS.APPLICATION_SUCCESS_MESSAGE').subscribe((message: string) => {
          this.notificationService.show(message, 'success');
        });
        this.applicationForm.reset();
        this.updateOfficePlaceholder();
      },
      error: (err) => {
        this.translateService.get('NOTIFICATIONS.APPLICATION_ERROR_MESSAGE').subscribe((message: string) => {
          const errorMessage = err.error?.message || message;
          this.notificationService.show(errorMessage, 'error');
        });
      },
    });
  }

  private updateOfficePlaceholder(): void {
    if (!this.applicationForm.get('office_id')?.value) {
      this.translateService.get('forms.placeholders.selectOffice').subscribe((translation) => {
        this.officeName = translation;
      });
    }
  }

  get client_name() {
    return this.applicationForm.get('client_name');
  }

  get phone() {
    return this.applicationForm.get('phone');
  }

  get office_id() {
    return this.applicationForm.get('office_id');
  }
}
