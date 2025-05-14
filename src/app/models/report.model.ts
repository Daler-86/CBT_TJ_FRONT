
  
export interface reportFile{
    id:number;
    name:string;
    upload_file:string;

}
export interface ReportFile{
 status:string;
 status_code:string;
 data:{
   total_count:number,
    report_files:reportFile[]
    
 }
}

export interface reportData{
  id:number;
  description:string;
  report_indicator:indecator[];
}
interface indecator{
  id:number;
  name:string;
  sort_id:number;
  report_indecator_data:indecator_data[]
}
interface indecator_data{

  id:number;
  title:string;
  description:string;
  sort_id:number
}
export interface ReportData{
status:string;
status_code:string;
data:{
  reports:reportData
}
}