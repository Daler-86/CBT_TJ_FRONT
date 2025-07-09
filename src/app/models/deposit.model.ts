export interface Deposit {
    id: number;
    title: string;
    description: string;
    upload_icon_file: string;
   
    sort_id:number;
    content_item:Content[]
  }
  interface Content{
    id:number;
    title:string;
    description:string;
    sort_id:number
  }

  export interface DepositsList {
    status: string;
    status_code: string;
    data: {
      deposits: Deposit[];
    };
  }
  export interface DepositDetail{
    status: string,
    status_code: string,
    data: depositDetail
  
  }
   export interface depositDetail{
        id?:number;
        title?:string;
        description?:string;
        upload_icon_file?:string;
        sort_id?:number;
        currency?:corency[];
      documents?:document[];
      faqs?:faq[];
    
      }

      interface corency{
        id:number;
        code:string;
        title:string;
        sort_id:number;
        tariffs:tariff[]
      }
      interface tariff{
        id:number;
        currency:string;
        title:string;
        description:string;
        sort_id:number;
      }
      interface document{
        id:number;
        title:string;
        upload_file:string;
        sort_id:number;
      }
      interface faq{
        id:number;
        title:string;
        description:string;
        sort_id:number;
      }


      // src/app/models/deposit.model.ts

export interface RateTier {
  minMonths: number;
  rate: number;
}

// export interface CurrencyDetails {
//   minAmount: number;
//   rates: RateTier[];
// }

export interface DepositProduct {
  name: string;
  currencies: {
    TJS: CurrencyDetails | null;
    USD: CurrencyDetails | null;
  };
}

export interface DepositProducts {
  [key: string]: DepositProduct;
}

// Модель для параметров расчета
export interface CalculationParams {
  productId: string;
  currency: 'TJS' | 'USD';
  amount: number;
  termMonths: number;
}

// Модель для результатов расчета
export interface CalculationResult {
  productName: string;
  rate: number;
  income: number;
  totalAmount: number;
  error?: string; // Поле для вывода ошибок
}
export interface CurrencyDetails {
  // Настройки для слайдера СУММЫ
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  amountLabels: string[];

  // Настройки для слайдера СРОКА
  minTerm: number;
  maxTerm: number;
  stepTerm: number;
  termLabels: string[];

  // Ставки для расчета
  rates: RateTier[];
}