import { TerminalItem } from "./region.model";

export interface Services {
    id: number;
    name: string;
    sort_id: string;
  }
  export interface IMapPoint {
    id: number | string;
    geometry: { type: 'Point'; coordinates: number[] };
    properties: {
      type: 'atm' | 'terminal' | 'office' | 'office_inactive';
      title: string;
      address: string;
      workHours: string;
      statusClass: string;
      iconSrc: string;
      items: TerminalItem[];
      services: Services[];
    };
  }