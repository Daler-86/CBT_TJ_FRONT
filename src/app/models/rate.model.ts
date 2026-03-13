
export interface ApiRate {
  cur: string;
  buy: string;
  sell: string;
  mode: string;
}

export interface ProcessedRate {
  currency: string;
  buy: number;
  sell: number;
  flag: string;
}

export type ExchangeRatesByMode = Record<string, ProcessedRate[]>;

export interface ApiResponse {
  status: string;
  data: {
    last_update: string;
    rates: {
      rate: ApiRate[];
    };
  };
}

export interface ProcessedData {
  ratesByMode: ExchangeRatesByMode;
  lastUpdated: string;
}
