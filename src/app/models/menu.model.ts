export interface mainGalleries{
    id:number;
    title:string;
    description:string;
    route:string;
    upload_file:string;
    sort_id:number;
    show_button:boolean
}
export interface MainGalleries{
 status:string;
 status_code:string;
 data:{
    main_galleries:[]
 }
}

 