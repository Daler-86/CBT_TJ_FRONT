import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef,HostListener, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { TransfersService } from '../../api/transfer.service';
import { MenuService } from '../../api/menu.service';
import { TransferDetail, transferDetail } from '../../models/transfers.model';
import { DepositsService } from '../../api/deposit.service';
import { depositDetail } from '../../models/deposit.model';
import { RegionService } from '../../api/region.service';
import { officeList } from '../../models/region.model';

@Component({
  selector: 'app-deposit-detail',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './deposit-detail.component.html',
  styleUrl: './deposit-detail.component.scss'
})
export class DepositDetailComponent {

  constructor(
    private route: ActivatedRoute,
    private transferService: TransfersService,
    private depositService:DepositsService,
    private elementRef: ElementRef,
    private menuService: MenuService,
    private regionService:RegionService,
  ) { }

  selectedFaqIndex: number | null = null;
  cardId: number=0;
  depositData:depositDetail={}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.cardId= +idParam;  // Преобразование строки в число
    } else {
      console.error('ID is missing in the route parameters.');
      // Здесь может быть код для обработки ситуации отсутствия ID
    }

    
    this.loadOffice();
    this.loadCards(this.cardId);

    this.updateSliderBackground('loanAmount');
    this.updateSliderBackground('loanTerm');
  }
  toggleFaq(index: number) {
    this.selectedFaqIndex = this.selectedFaqIndex === index ? null : index;
  }
  loadCards(id:number):void {
    this.depositService.getDepositData(id).subscribe(
      (response) => {
    
        this.depositData = response.data;
        
      },
      (error) => {
        console.error('Ошибка при запросе данных', error);
      }
    );
  }

  selectedTab: string = 'TJS';
  loanAmount: number = 30000;
  loanTerm: number = 24;
  interestRate: number = 30;
  loanAmountLabels: string[] = ['10 000с.', '30 000с.', '60 000с.', '80 000с.', '200 000с.'];
  loanTermLabels: string[] = ['12 мес', '24 мес', '36 мес', '48 мес'];
  selectedCurrency: string = 'Сомони (TJS)';
  depositAmount: number = 20000;
  depositTerm: number = 12;
  // interestRate: number = 10;

  currencies: string[] = ['Сомони (TJS)', 'Доллар (USA)', 'Евро (EUR)'];
  depositAmountLabels: string[] = ['10 000с.', '30 000с.', '60 000с.', '80 000с.', '100 000с.'];
  depositTermLabels: string[] = ['3 мес', '6 мес', '9 мес', '12 мес', '24 мес', '36 мес'];

  formattedDepositAmount: string = this.formatCurrency(this.depositAmount);
  formattedDepositTerm: string = this.formatTerm(this.depositTerm);

  formattedLoanAmount: string = this.formatCurrency(this.loanAmount);
  formattedLoanTerm: string = this.formatTerm(this.loanTerm);


  
  updateFormattedLoanAmount() {
      this.formattedLoanAmount = this.formatCurrency(this.loanAmount);
    
  }
  

  updateFormattedLoanTerm() {
      this.formattedLoanTerm = this.formatTerm(this.loanTerm);
    
    }

  selectTab(tab: string) {
    this.selectedTab = tab;
   
  }
  loanAmountPercent: string = '';
  loanTermPercent: string = '';
  depositAmountPercent: string = '';
  depositTermPercent: string = '';
  updateSliderBackground(sliderType: string) {
    if (sliderType === 'loanAmount') {
      const percent = ((this.loanAmount - 10000) / (200000 - 10000)) * 100;
      this.loanAmountPercent = `${percent}%`;
    } else if (sliderType === 'loanTerm') {
      const percent = ((this.loanTerm - 12) / (48 - 12)) * 100;
      this.loanTermPercent = `${percent}%`;
    }
  }
  updateDepositSliderBackground(sliderType: string) {
    if (sliderType === 'depositAmount') {
      const percent = ((this.depositAmount - 10000) / (100000 - 10000)) * 100;
      this.depositAmountPercent = `${percent}%`;
    } else if (sliderType === 'depositTerm') {
      const percent = ((this.depositTerm - 3) / (36 - 3)) * 100;
      this.depositTermPercent = `${percent}%`;
    }
  }
  
  calculateMonthlyPayment(): number {
      const months = this.loanTerm;
      const monthlyInterest = this.interestRate / 100 / 12;
      const payment = (this.loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
      return Math.round(payment);
  }
    // Обработка изменения суммы через поле ввода
  onLoanAmountChange(value: string) {
    const rawValue = +value.replace(/\D/g, ''); // Убираем символы, кроме цифр
    if (rawValue >= 10000 && rawValue <= 200000) {
      this.loanAmount = Math.round(rawValue / 50) * 50; // Округляем до ближайшего шага 50
      this.updateFormattedLoanAmount(); // Обновляем форматированную сумму

    }
  }

  applyForLoan() {
      alert('Вы оформили кредит на сумму ' + this.loanAmount + 'с.');
  }

  selectCurrency(currency: string) {
    this.selectedCurrency = currency;
}

updateFormattedDepositAmount() {
    this.formattedDepositAmount = this.formatCurrency(this.depositAmount);
}

updateFormattedDepositTerm() {
    this.formattedDepositTerm = this.formatTerm(this.depositTerm);
}

formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value) + ' с.';
}

formatTerm(value: number): string {
    return `${value} мес`;
}

calculateDepositIncome(): number {
    return Math.round((this.depositAmount * this.interestRate * this.depositTerm) / 1200);
}

calculateFinalAmount(): number {
    return this.depositAmount + this.calculateDepositIncome();
}

applyForDeposit() {
    alert('Вы оформили вклад на сумму ' + this.depositAmount + 'с.');
}
onDepositAmountChange(value:any){
  
}
officeName:string='Выберите отделение банка'
offices:officeList[]=[]
loadOffice(): void {
  this.regionService.getOfficeList().subscribe(
    (response) => {
      this.offices = response.data.offices;
    },
    (error) => {
      console.error('Ошибка при запросе данных', error);
    }
  );
}
model = {
  card_id: 0,
  client_name: '',
  office_id: 0,
  phone: ''
};
submitApplication() {

  if (this.model.phone && this.model.client_name && this.model.office_id) {
    console.log(this.model)
    this.model.card_id=this.cardId
    this.depositService.submitDeposit(this.model).subscribe(resp =>{
      console.log(resp);
      
    },(err =>{
      console.log(err);
    }));
}
}

dropdownOpen:boolean=false;
toggleDropdown(event: Event) {
this.dropdownOpen = !this.dropdownOpen;
event.stopPropagation(); // Останавливаем распространение события
}
@HostListener('document:click', ['$event'])

selectOption( event: Event,item:officeList) {
this.officeName = item?.name; // Обновляем имя для отображения
this.model.office_id = item?.id; 
event.stopPropagation();
this.dropdownOpen = false;

}



}
