export interface InfoItem {
    id: number;
    label: string;
    value: string;
    isEmail?: boolean; // Флаг для форматирования как email ссылки
    isPhone?: boolean; // Флаг для форматирования как телефонной ссылки
  }

  export interface bankDetails {
    id: number;
    title: string;
    description: string;
  
    sort_id:number;
   
  }
  
  export interface BankDetails {
    status: string;
    status_code: string;
    data: {
      bank_details: bankDetails[];
    };
  }
  