export interface regionList{
    id:number;
    name:string;
}
export interface RegionList{
 status:string;
 status_code:string;
 data:{
    regions: regionList[]
 }
}