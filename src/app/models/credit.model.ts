export interface CreditList {
    status: string;
    status_code: string;
    data: {
      credits: creditList[];
    }
  }


export interface creditList{
  id:number ,
  title:string,
  description:string,
  upload_file:string,
  sort_id:number,
  content:details[]
}

interface details{
    id:number,
    title:string,
    description:string,
    sort_id:number
}

export interface creditTariff{
  id:number ,
  name:string,
  sort_id:number,
  items:details[]
}
export interface CreditTariff {
  status: string;
  status_code: string;
  data: {
    credit_tariffs: creditTariff[];
  }
}

export interface creditDocument{
  id:number;
  name:string;
  sort_id:number;
  upload_file:string
}
export interface CreditDocument {
  status: string;
  status_code: string;
  data: {
    credit_documents: creditDocument[];
  }
}
// "credit_documents": [
//   {
//     "id": 1,
//     "name": "Паспорт гражданина Республики Таджикистан (оригинал)",
//     "sort_id": 1,
//     "upload_file": "847d6bb6-12f1-4ee0-b596-2b425178f0f7User Id.png"
//   },


