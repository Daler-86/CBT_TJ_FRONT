// models/cards.model.ts

export interface CardContent {
    id: number;
    title: string;
    description: string;
    sort_id: number;
  }
  
  export interface Card {
    id: number;
    title: string;
    description: string;
    upload_file: string;
    content: CardContent[];
  }
  
  export interface CardList {
    status: string;
    status_code: string;
    data: {
      cards: Card[];
    };
  }
  export interface CardBrand{
    id:number,
    name:string,
    description:string,
    code:string,
  }
  export interface CardBrandsResponse {
    status: string;
    status_code: string;
    data: {
      card_brands: CardBrand[];
    }
  }
export interface CardContent{
  id: number,
  title: string,
  description:string,
  upload_file: string,
  sort_id: number
}
export interface CardContentItem{

   status: string;
    status_code: string;
    data: {
      card_content_items: CardContent[];
    }
}

// "status": "success",
// "status_code": "200",
// "data": {
//   "card-helpful-documents": [
//     {
//       "id": 1,
//       "name": "Ариза барои аз нав баровардани корт",
//       "upload_file": "405e3d72-0202-4700-9a54-c9f86141acf0using_lumberjack.pdf",
//       "sort_id": 1
//     },

export interface helpfulDocument{
  id: number,
  name: string,
  upload_file: string,
  sort_id: number
}
export interface CardHelpfulDocument{

  status: string;
   status_code: string;
   data: {
     "card-helpful-documents": helpfulDocument[];
   }
}

export interface cardLimits{
    id: number,
    name: string,
    tjs: number,
    rub: number,
    usd: number,
    sort_id: number
  }
  export interface CardLimits{
    status: string;
    status_code: string;
    data: {
      card_limits: cardLimits[];
    }
  }


export interface cardOperations{
  id:number ,
  name:string,
  title:string,
  description:string,
  sort_id:number,

}
  export interface CardOperations{
    status:string;
    status_code:string;
    data:{
       card_operations:cardOperations[]
      }
  }
export interface cardServices{
  id:number,
  name:string,
  title:string,
  description:string,
  sort_id:number,
}
 
export interface CardServices{
  status:string;
  status_code:string;
  data:{
    card_services:cardServices[]
  }
}