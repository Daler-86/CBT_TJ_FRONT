
  export interface rkoResponce{
    status:string,
    status_code:string,
    data:{
        scss:scs[]
    }
  }
  export interface scs{
    id:number,
    title:string,
    description:string,
    upload_file:string,
    sort_id:number,
    scs_item:scsItem[]
  }
  export interface scsItem{
    id:number,
    title:string,
    description:string,
    sort_id:number
  }


      
      export interface scsDetail{
        id?:number,
        title?:string,
        description?:string,
        upload_file?:string,
        sort_id?:number,
        advantages?:advantage[],
        conditions?:condition[]

      }
    
      export interface scsDetailResponse{
        status:string,
        status_code:string,
        data: scsDetail

        
      }

      
      
      
      export interface advantage{
        id:number,
        title:string,
        description:string,
        sort_id:number
      }
     export interface condition{
        id:number,
        title:string,
        sort_id:number,
        items: conditionItem[]
     }

     export interface conditionItem{
        id:number,
        title:string,
        sort_id:number
     } 
