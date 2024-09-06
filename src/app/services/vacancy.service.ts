import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Vacancy {
  id: number;
  title: string;
  city: string;
  educationAndQualification?: string[];
  workExperience?: string[];
  skillsAndKnowledge?: string[];
  personalQualities?: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  // Инициализация BehaviorSubject со списком вакансий
  private vacancies = new BehaviorSubject<Vacancy[]>([
    {
      id: 1,
      title: 'Кредитный консультант',
      city: 'Душанбе',
      educationAndQualification: ['Среднее специальное или высшее образование, предпочтительно в сфере экономики, финансов или бухгалтерского учета.','Курсы по работе с кассовыми аппаратами и платежными системами будут преимуществом.'],
      workExperience: ['Опыт работы на наличной денежной деятельности от 1 года.','Опыт работы с наличными денежными средствами, валютными операциями и банковскими услугами.'],
      skillsAndKnowledge: [
        'Знание кассовой дисциплины и основ бухгалтерского учета.',
        'Умение работать с кассовым аппаратом, терминалом для оплаты картами и другими кассовыми устройствами.',
        'Знание основных банковских операций (прием платежей, обмен валют, работа с вкладами и т.д.).',
        'Владение ПК, знание офисных программ (Word, Excel) и банковского ПО.'
      ],
      personalQualities: [
        'Вежливость и умение работать с клиентами.',
        'Стрессоустойчивость и способность работать в условиях высокой нагрузки.',
        'Коммуникабельность и умение работать в команде.',
        'Аккуратность и пунктуальность.'
      ]
    },
    {
      id: 2,
      title: 'Кассир',
      city: 'Пенджикент',
      educationAndQualification:[ 'Среднее специальное или высшее образование, предпочтительно в сфере экономики, финансов или бухгалтерского учета.','Курсы по работе с кассовыми аппаратами и платежными системами будут преимуществом.'],
      workExperience:[ 'Опыт работы на наличной денежной деятельности от 1 года.'],
      skillsAndKnowledge: [
        'Знание кассовой дисциплины и основ бухгалтерского учета.',
        'Умение работать с кассовым аппаратом, терминалом для оплаты картами и другими кассовыми устройствами.',
        'Знание основных банковских операций (прием платежей, обмен валют, работа с вкладами и т.д.).',
        'Владение ПК, знание офисных программ (Word, Excel) и банковского ПО.'
      ],
      personalQualities: [
        'Вежливость и умение работать с клиентами.',
        'Стрессоустойчивость и способность работать в условиях высокой нагрузки.',
        'Коммуникабельность и умение работать в команде.',
        'Аккуратность и пунктуальность.'
      ]
    },
    {
      id: 3,
      title: 'Кредитный консультант в кредитный отдел',
      city: 'Душанбе'
    },
    {
      id: 4,
      title: 'Аудитор в корпоративный отдел',
      city: 'Душанбе'
    },
    {
      id: 5,
      title: 'Инкассаторы на ночную смену',
      city: 'Худжанд'
    },
    {
      id: 6,
      title: 'Специалисты колл центра',
      city: 'Бохтар'
    },
    {
      id: 7,
      title: 'Специалист по работе с клиентами',
      city: 'Пенджикент'
    },
    {
      id: 8,
      title: 'Финансовый аналитик',
      city: 'Душанбе'
    }
  ]);

  // BehaviorSubject для хранения выбранной вакансии
  private selectedVacancy = new BehaviorSubject<Vacancy | null>(null);

  // Массивы городов и категорий
  private cities: City[] = [
    { id: 1, name: 'Душанбе' },
    { id: 2, name: 'Пенджикент' },
    { id: 3, name: 'Худжанд' },
    { id: 4, name: 'Бохтар' }
  ];

  private categories: Category[] = [
    { id: 1, name: 'Банковское дело' },
    { id: 2, name: 'Финансы' },
    { id: 3, name: 'Аудит' },
    { id: 4, name: 'IT' }
  ];

  // Методы для получения Observable массивов городов и категорий
  getCities(): Observable<City[]> {
    return of(this.cities);
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  // Метод для получения Observable списка вакансий
  getVacancies(): Observable<Vacancy[]> {
    return this.vacancies.asObservable();
  }

  // Метод для выбора вакансии
  selectVacancy(vacancy: Vacancy) {
    this.selectedVacancy.next(vacancy);
    console.log(vacancy);
  }

  // Метод для получения Observable выбранной вакансии
  getSelectedVacancy(): Observable<Vacancy | null> {
    return this.selectedVacancy.asObservable();
  }
    // Новый метод для получения вакансии по ID
    getVacancyById(id: number): Vacancy | undefined {
      return this.vacancies.value.find(vacancy => vacancy.id === id);
    }
}
