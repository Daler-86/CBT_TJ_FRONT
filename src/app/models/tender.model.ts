export interface Tender {
  id: number; // Добавим ID для ключа в *ngFor
  description: string;
  startDate: string;
  endDate: string;
  status: 'Открытый' | 'Завершенный'; // Используем Union Type для статуса
}

export interface tender {
  id: number;
  responsible_person: string;
  phone_number: string;
  email: string;
  status: string;
  start_date: string;
  end_date: string;
  name: string;
  upload_file: string;
}

export interface TenderData {
  status: string;
  status_code: string;
  data: {
    total_count: number;
    tenders: tender[];
  };
}

export interface tenderDetail {
  id?: number;
  responsible_person?: string;
  phone_number?: string;
  email?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  name?: string;
  upload_file?: string;
  information?: information[];
}
interface information {
  id: number;
  sort_id: number;
  title: string;
  description: string;
}

export interface TenderdetailData {
  status: string;
  status_code: string;
  data: {
    tender: tenderDetail;
  };
}
