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

export interface officeList{
    id:number;
    name:string;
}
export interface OfficeList{
 status:string;
 status_code:string;
 data:{
    offices: officeList[]
 }
}