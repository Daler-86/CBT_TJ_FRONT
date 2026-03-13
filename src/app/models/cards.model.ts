
export interface CardContent {
  id: number;
  title: string;
  description: string;
  sort_id: number;
}

export interface Card {
  id: number;
  title: string;
  description: string;
  upload_file: string;
  sort_id: number;
  content: CardContent[];
}

export interface CardList {
  status: string;
  status_code: string;
  data: {
    cards: Card[];
  };
}
export interface CardBrand {
  id: number;
  name: string;
  description: string;
  code: string;
}
export interface CardBrandsResponse {
  status: string;
  status_code: string;
  data: {
    card_brands: CardBrand[];
  };
}
export interface cardContentItem {
  id: number;
  title: string;
  description: string;
  upload_file: string;
  sort_id: number;
}
export interface CardContentItem {
  status: string;
  status_code: string;
  data: {
    card_content_items: cardContentItem[];
  };
}
export interface helpfulDocument {
  id: number;
  name: string;
  upload_file: string;
  sort_id: number;
}
export interface CardHelpfulDocument {
  status: string;
  status_code: string;
  data: {
    'card-helpful-documents': helpfulDocument[];
  };
}
export interface cardLimits {
  id: number;
  name: string;
  tjs: number;
  rub: number;
  usd: number;
  sort_id: number;
}
export interface CardLimits {
  status: string;
  status_code: string;
  data: {
    card_limits: cardLimits[];
  };
}

export interface cardOperations {
  id: number;
  name: string;
  title: string;
  description: string;
  sort_id: number;
}
export interface CardOperations {
  status: string;
  status_code: string;
  data: {
    card_operations: cardOperations[];
  };
}

export interface cardServices {
  id: number;
  name: string;
  title: string;
  description: string;
  sort_id: number;
}

export interface CardServices {
  status: string;
  status_code: string;
  data: {
    card_services: cardServices[];
  };
}
export interface CardFaqs {
  status: string;
  status_code: string;
  data: {
    card_faqs: cardFaqs[];
  };
}
export interface cardFaqs {
  id: number;
  title: string;
  description: string;
  sort_id: number;
}

export interface SaveCard {
  status: string;
  title: string;
  // card_order:
}

export interface cardDetail {
  id: number;
  title?: string;
  description?: string;
  upload_file?: string;
  sort_id?: number;
}

export interface CardDetail {
  status: string;
  status_code: string;
  data: {
    card_data: cardDetail;
  };
}
