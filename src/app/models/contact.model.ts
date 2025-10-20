// src/app/models/contact.model.ts

// Описание вложенного элемента (например, "Маркази тамос")
export interface ContactDetail {
  id: number;
  title: string;
  Description: string; // Обрати внимание на большую "D"
  upload_file: string;
  sort_id: number;
}
export interface ContactPayload {
  client_name: string;
  phone: string;
  contact_subject_id: number;
  question: string;
}

// Описание основной карточки контакта (например, "Связаться", "Адрес")
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

// Описывает данные, которые отправляются на сервер
export interface ContactFormPayload {
  client_name: string;
  contact_subject_id: number;
  phone: string;
  question: string;
}
// Ответ от API
export interface ContactResponse {
  status: string;
  status_code: string;
  data: {
    contacts: ContactBlock[];
    subjects: ContactSubject[];
  };
}
