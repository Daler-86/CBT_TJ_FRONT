export interface mainGalleries{
    id:number;
    title:string;
    description:string;
    route:string;
    upload_file:string;
    background_file:string;
    sort_id:number;
    show_button:boolean

 
}
export interface MainGalleries{
 status:string;
 status_code:string;
 data:{
    main_galleries:mainGalleries[]
 }
}
export interface Menu {
    id: number;
    name: string;
    route: string;
    person_type_id: number;
    sort_id: number;
    is_new_tab: boolean;
    items: MenuItem[];
    favorites: FavoriteItem[];
  }
  
  export interface MenuItem {
    id: number;
    name: string;
    route: string;
    is_new_tab: boolean;
    sort_id: number;
  }
  
  export interface FavoriteItem {
    id: number;
    name: string;
    route: string;
    sort_id: number;
    is_new_tab: boolean;
    upload_file: string;
  }
  
  export interface MenusResponse {
    status: string;
    status_code: string;
    data: {
      menus: Menu[];
    };
  }
  

 