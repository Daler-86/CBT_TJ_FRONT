
export interface vacancyContent{
    id:number;
    title:string;
    description:string;
    file_name:string
}
export interface VacancyContent{
 status:string;
 status_code:string;
 data:{
    vacancy_contents:vacancyContent[]
 }
}
export interface vacancyItem{
    id:number;
    title:string;
    description:string;
    upload_file:string;
    sort_id:number;
}
export interface VacancyItem{
 status:string;
 status_code:string;
 data:{
    vacancy_content_items:vacancyItem[]
 }
}
export interface vacancyStatistic{
    id:number;
    title:string;
    description:string;
    file_name:string
}
export interface VacancyStatistic{
 status:string;
 status_code:string;
 data:{
    vacancy_content_statistics:vacancyStatistic[]  
 }
}

export interface vacancyGallery{
    id:number;
    title:string;
    description:string;
    upload_file:string
}
export interface VacancyGallery{
 status:string;
 status_code:string;
 data:{
    "vacancy_galleries":vacancyGallery[]
 }
}

export interface vacancyCategory{
    id:number;
    name:string;
}
export interface VacancyCategory{
 status:string;
 status_code:string;
 data:{
    vacancy_categories: vacancyCategory[]
 }
}

export interface vacancyList{
    id:number;
    name:string;
    region_name:string;

}
export interface VacancyList{
 status:string;
 status_code:string;
 data:{
    vacancies:vacancyList[]
    
 }
}

export interface personalQuality{
    id:number;
    content:string;
    sort_id:number
}
export interface PersonalQuality{
 status:string;
 status_code:string;
 data:{
    vacancy_personal_qualities:personalQuality[]
 }
}

export interface vacancyCondition{
    id:number;
    content:string;
    sort_id:number
}

export interface VacancyCondition{
 status:string;
 status_code:string;
 data:{
    vacancy_conditions:vacancyCondition[]
 }
}

export interface vacancyEducation{
    id:number;
    content:string;
    sort_id:number
}
export interface VacancyEducation{
 status:string;
 status_code:string;
 data:{
    vacancy_educations:vacancyEducation[]
    
 }
}

export interface vacancyExperience{
    id:number;
    content:string;
    sort_id:number
}
export interface VacancyExperience{
 status:string;
 status_code:string;
 data:{
    vacancy_experiences:vacancyExperience[]
    
 }
}
export interface vacancySkill{
    id:number;
    content:string;
    sort_id:number
}
export interface VacancySkill{
 status:string;
 status_code:string;
 data:{
    vacancy_skills:vacancySkill[]
    
 }
}

export interface VacancyByCategory{
 status:string;
 status_code:string;
 data:{
    vacancies:vacancyList[]
 }
}

export interface vacancyData{
   id:number;
   name:string;
   region_name:string
}
export interface VacancyData{
status:string;
status_code:string;
data:{
   vacancy_data:vacancyData
   
}
}