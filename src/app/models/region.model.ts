export interface regionList {
  id: number;
  name: string;
}
export interface RegionList {
  status: string;
  status_code: string;
  data: {
    regions: regionList[];
  };
}

export interface officeList {
  id: number;
  name: string;
}
export interface OfficeList {
  status: string;
  status_code: string;
  data: {
    offices: officeList[];
  };
}
export interface OfficeFaqs {
  status: string;
  status_code: string;
  data: {
    office_faqs: officeFaqs[];
  };
}
export interface officeFaqs {
  id: number;
  title: string;
  description: string;
  sort_id: number;
}

export interface FilteredData {
  status: string; 
  status_code: string;
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
  latitude: string; 
  longitude: string; 
  is_24_time: boolean; 
  items: TerminalItem[]; 
}

export interface Atm {
  id: number;
  name: string;
  address: string;
  latitude: string; 
  longitude: string; 
  is_24_time: boolean; 
  items: TerminalItem[]; 
}

export interface Terminal {
  id: number;
  name: string;
  address: string;
  latitude: string; 
  longitude: string; 
  is_24_time: boolean; 
  items: TerminalItem[]; 
}

export interface TerminalItem {
  id: number;
  title: string;
  description: string;
  sort_id: number;
}

export interface FilteredByRegion {
  status: string;
  status_code: string; 
  data: {
    list_data: Terminal[] | Atm[] | Office[];
    total_count: number;
  };
}
