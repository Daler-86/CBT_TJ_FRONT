// src/app/models/merchant.model.ts

// Описание одного мерчанта
export interface Merchant {
    id: number;
    name: string;
    address: string;
    phone: string;
    upload_file: string; // URL логотипа
    has_cashback: boolean;
  }
  
  // Ответ от API для списка мерчантов
  export interface MerchantListResponse {
    status: string;
    status_code: string;
    data: {
      total_count: number;
      merchants: Merchant[];
    }
  }
  
  // Описание одной категории мерчантов
  export interface MerchantCategory {
    id: number;
    name: string;
  }
  
  // Ответ от API для списка категорий
  export interface MerchantCategoryResponse {
    status: string;
    status_code: string;
    data: {
      merchant_categories: MerchantCategory[];
    }
  }