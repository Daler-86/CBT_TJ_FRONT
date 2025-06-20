// src/app/models/contact.model.ts

// Описание вложенного элемента (например, "Маркази тамос")
export interface ContactDetail {
    id: number;
    title: string;
    Description: string; // Обрати внимание на большую "D"
    upload_file: string;
    sort_id: number;
  }
  
  // Описание основной карточки контакта (например, "Связаться", "Адрес")
  export interface ContactBlock {
    id: number;
    title: string;
    upload_file: string;
    sort_id: number;
    data: ContactDetail[];
  }
  
  // Ответ от API
  export interface ContactResponse {
    status: string;
    status_code: string;
    data: {
      contacts: ContactBlock[];
    }
  }