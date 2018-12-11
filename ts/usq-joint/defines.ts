import { Mapper } from "./tool/mapper";

export type DataPull = (settings:Settings, queue:number)=>Promise<number>;
export type DataPush = (settings:Settings, data:any)=>Promise<void>;

export type UsqInConverter = (settings:Settings, data:any)=>Promise<void>;
export interface UsqIn {
    usq: string;
    type: 'tuid' | 'map' | 'action';
    entity: string;
    key: string;
    mapper: Mapper;
}

export type UsqOutConverter = (settings:Settings, queue:number)=>Promise<{queue:number, data:any}>;
export interface UsqOut {
    usq: string;
    type: 'sheet';
    entity: string;
    key: string;    
    mapper: Mapper;
    push?: DataPush;
}

export interface Settings {
    unit: number;
    allowedIP: string[];
    in: {[name:string]: UsqIn | UsqInConverter};
    out: {[name:string]: UsqOut | UsqOutConverter};
    pull: {[name:string]: DataPull};
    //push: {[name:string]: DataPush};
}
