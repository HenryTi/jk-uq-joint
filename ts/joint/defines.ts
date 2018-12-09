import { Mapper } from "./tool/mapper";

export const usqs = {
    jkProduct: 'JKDev/jkProduct',
}

export type Converter = (data:any)=>Promise<void>;
export interface UsqIn {
    usq: string;
    type: 'tuid';
    entity: string;
    key: string;
    mapper: Mapper;
}

export interface UsqOut {
    usq: string;
    type: 'sheet';
    entity: string;
    key: string;
    mapper: Mapper;
}

export interface Settings {
    unit: number;
    allowedIP: string[];
    in: {[name:string]: UsqIn | Converter};
    out: {[name:string]: UsqOut | Converter};
    /*
    usqs: {[usq:string]: {
        [type:string]: {
            [name:string]: {write?: Mapper; read?: Mapper}; // | ((data:any)=>Promise<number>)
        }
    }}
    */
}
