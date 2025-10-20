export interface CardContent {
  id: number;
  title: string;
  description: string;
  sort_id: number;
}

export interface Transfer {
  id: number;
  title: string;
  description: string;
  upload_icon_file_id: string;
  link: string;
  upload_tariff_file_id: string;
  sort_id: number;
}

export interface TransfersList {
  status: string;
  status_code: string;
  data: {
    transfers: Transfer[];
  };
}

interface cond {
  id: number;
  title: string;
  description: string;
  sort_id: number;
  items: item[];
}
interface item {
  id: number;
  title: string;
  sort_id: number;
}

interface doc {
  id: number;
  title: string;
  sort_id: number;
  items: item[];
}
export interface transferDetail {
  id?: number;
  title?: string;
  description?: string;
  upload_icon_file_id?: string;
  upload_tariff_file_id?: string;
  link?: string;
  sort_id?: number;
  conditions?: cond[];
  documents?: doc[];
}

export interface TransferDetail {
  status: string;
  status_code: string;
  data: {
    transfer_data: transferDetail;
  };
}
