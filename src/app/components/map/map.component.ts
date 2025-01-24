import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component,ElementRef,HostListener, ViewChild, } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegionService } from '../../api/region.service';
import { Atm, FilteredData, Office, Terminal, officeList, regionList } from '../../models/region.model';
import { cardFaqs } from '../../models/cards.model';
import { CardsService } from '../../api/cards.service';
import { OfficeListComponent } from "../office-list/office-list.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, RouterLink, RouterModule, TranslateModule, NgIf, NgFor, CommonModule, OfficeListComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})

export class MapComponent {
  constructor(
    private filterService: RegionService,
    private translateService: TranslateService,
    private cardsService: CardsService
  ) {}

  center: google.maps.LatLngLiteral = { lat: 38.5367, lng: 68.7803 };
  zoom = 13;
  selectedTab: string = 'NaKarte';
  markers = [
    { position: { lat: 38.5367, lng: 68.7803 }, label: '1', info: 'Точка 1' },
    { position: { lat: 38.5377, lng: 68.7853 }, label: '2', info: 'Точка 2' },
    { position: { lat: 38.5407, lng: 68.7903 }, label: '3', info: 'Точка 3' },
  ];

  // offices: any[] = [];
  filterOptions: {
    types: string[];
    accessibility: string[];
    additional: string[];
  } = {
    types: [],
    accessibility: [],
    additional: [],
  };

  allSelected: boolean = false;
  terminalsSelected: boolean = false;
  officesSelected: boolean = false;
  atmsSelected: boolean = false;
  
  is24Selected: boolean = false;
  workingNowSelected: boolean = false;
  
  qrCodeSelected: boolean = false;
  nfcSelected: boolean = false;

  dropdownOpen: boolean = false;
  dropdownOpen2: boolean = false;

  regionSelected:number=0
  regionList: any[] = [];
  faqs: { title: string; description: string }[] = [];
  selectedFaqIndex: number | null = null;
offices:Office[]=[];
atms:Atm[]=[];
terminals:Terminal[]=[];
 
data:any[]=[]
  @HostListener('document:click', ['$event'])
  closeDropdownsManual(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.dropdownOpen = false;
      this.dropdownOpen2 = false;
    }
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    // event.stopPropagation();
  }

  toggleDropdown2(event: Event): void {
    this.dropdownOpen2 = !this.dropdownOpen2;
    // event.stopPropagation();
  }

  showInfo(markerInfo: string) {
    alert(markerInfo);
  }
  regionSelectedName='Город'
  ngOnInit(): void {
    document.addEventListener('click', this.closeDropdownsManual.bind(this));


    this.filterService.getRegionList().subscribe(
      (response) => {
        this.regionList = response.data.regions;
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
    this.allSelected = true;
    this.loadCardFaqs();
   this.sendFilteredData();
  }

  loadCardFaqs(): void {
    this.filterService.getCardFaqs().subscribe(
      (details) => {
        this.faqs = details.data.office_faqs;
      },
      (error) => {
        console.error('Ошибка при получении деталей карты', error);
      }
    );
  }

  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }



  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdownsManual.bind(this));
    this.sendFilteredData()
  }
  combinedData: any[] = [];
  sendFilteredData(): void {
    this.filterService.getFilteredData(this.atmsSelected, this.is24Selected, this.officesSelected, this.regionSelected, this.terminalsSelected, this.workingNowSelected).subscribe({
      next: (response) => {
        console.log('Filtered data received:', response);
             this.terminals=response.data.terminals
             this.atms=response.data.atms
             this.offices=response.data.offices
             this.combinedData = [
              ...(response.data.terminals || []),
              ...(response.data.atms || []),
              ...(response.data.offices || [])
            ];
      },
      error: (err) => {
        console.error('Error fetching filtered data:', err);
      }
    });
  }
  onCheckboxChange(variableName: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  
    // Проверяем, существует ли свойство
    if (inputElement && variableName in this) {
      (this as any)[variableName] = inputElement.checked;
      console.log(`${variableName} changed to:`, (this as any)[variableName]);
      this.sendFilteredData()
    }
  }

  onRegionChange(obj:any){
    this.regionSelected=obj.id
    this.regionSelectedName=obj.name
    this.sendFilteredData()
    this.dropdownOpen2=false
  }

}



