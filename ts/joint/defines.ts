import { Mapper } from "./tool/mapper";

export const usqs = {
    jkOrder: 'JKDev/jkOrder',
    jkProduct: 'JKDev/jkProduct',
}

export type UsqInConverter = (data:any)=>Promise<void>;
export interface UsqIn {
    usq: string;
    type: 'tuid';
    entity: string;
    key: string;
    mapper: Mapper;
}

export type UsqOutConverter = (queue:number)=>Promise<{queue:number, data:any}>;
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
    in: {[name:string]: UsqIn | UsqInConverter};
    out: {[name:string]: UsqOut | UsqOutConverter};
    /*
    usqs: {[usq:string]: {
        [type:string]: {
            [name:string]: {write?: Mapper; read?: Mapper}; // | ((data:any)=>Promise<number>)
        }
    }}
    */
}
