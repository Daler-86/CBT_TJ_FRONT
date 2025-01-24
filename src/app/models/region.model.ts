export interface regionList{
    id:number;
    name:string;
}
export interface RegionList{
 status:string;
 status_code:string;
 data:{
    regions: regionList[]
 }
}

export interface officeList{
    id:number;
    name:string;
}
export interface OfficeList{
 status:string;
 status_code:string;
 data:{
    offices: officeList[]
 }
}
export interface OfficeFaqs{
    status: string,
    status_code: string,
    data: {
        office_faqs:officeFaqs[]
  }
  }
  export interface officeFaqs{
  id:number;
  title:string;
  description:string;
  sort_id:number
  }


  export interface FilteredData {
    status: string; // "success" или другой статус
    status_code: string; // Код статуса, например "200"
    data: {
      offices: Office[];
      atms: Atm[];
      terminals: Terminal[];
    };
  }
  
  export interface Office {
    id: number;
    parent_id: number;
    name: string;
    address: string;
    latitude: string; // Координаты широты
    longitude: string; // Координаты долготы
    is_24_time: boolean; // Работает ли 24/7
    items: any[]; // Массив объектов, если есть дополнительные данные (определите типы при необходимости)
    services: any[]; // Массив сервисов (определите типы при необходимости)
  }
  
  export interface Atm {
    id: number;
    name: string;
    address: string;
    latitude: string; // Координаты широты
    longitude: string; // Координаты долготы
    is_24_time: boolean; // Работает ли 24/7
    items: any[]; // Массив объектов (определите типы при необходимости)
  }
  
  export interface Terminal {
    id: number;
    name: string;
    address: string;
    latitude: string; // Координаты широты
    longitude: string; // Координаты долготы
    is_24_time: boolean; // Работает ли 24/7
    items: TerminalItem[]; // Массив объектов типа TerminalItem
  }
  
  export interface TerminalItem {
    id: number;
    title: string;
    description: string;
    sort_id: number;
  }
  
  export interface FilteredByRegion {
    status: string; // "success" или другой статус
    status_code: string; // Код статуса, например "200"
    data: {
      list_data: any[];
    
    };
  }
  