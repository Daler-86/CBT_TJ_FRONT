// src/app/interfaces/currency.interface.ts

// Интерфейс для одного курса валюты, как он приходит от API
export interface ApiRate {
    cur: string;
    buy: string;
    sell: string;
    mode: string;
  }
  
  // Интерфейс для данных, которые мы будем использовать в компоненте
  export interface ProcessedRate {
    currency: string;
    buy: number;
    sell: number;
    flag: string;
  }
  
  // Интерфейс для сгруппированных по режимам курсов
  export interface ExchangeRatesByMode {
    [mode: string]: ProcessedRate[];
  }
  
  // Интерфейс для всего ответа API
  export interface ApiResponse {
    status: string;
    data: {
      last_update: string;
      rates: {
        rate: ApiRate[];
      };
    };
  }
  
  // Интерфейс для данных, которые сервис вернет компоненту
  export interface ProcessedData {
    ratesByMode: ExchangeRatesByMode;
    lastUpdated: string;
  }