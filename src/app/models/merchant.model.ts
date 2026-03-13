
export interface Merchant {
  id: number;
  name: string;
  address: string;
  phone: string;
  upload_file: string; 
  has_cashback: boolean;
}

export interface MerchantListResponse {
  status: string;
  status_code: string;
  data: {
    total_count: number;
    merchants: Merchant[];
  };
}

export interface MerchantCategory {
  id: number;
  name: string;
}

export interface MerchantCategoryResponse {
  status: string;
  status_code: string;
  data: {
    merchant_categories: MerchantCategory[];
  };
}
