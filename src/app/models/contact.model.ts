
export interface ContactDetail {
  id: number;
  title: string;
  Description: string; 
  upload_file: string;
  sort_id: number;
}
export interface ContactPayload {
  client_name: string;
  phone: string;
  contact_subject_id: number;
  question: string;
}

export interface ContactBlock {
  id: number;
  title: string;
  upload_file: string;
  sort_id: number;
  data: ContactDetail[];
}
export interface ContactSubject {
  id: number;
  name: string;
}

export interface ContactFormPayload {
  client_name: string;
  contact_subject_id: number;
  phone: string;
  question: string;
}

export interface ContactResponse {
  status: string;
  status_code: string;
  data: {
    contacts: ContactBlock[];
    subjects: ContactSubject[];
  };
}
