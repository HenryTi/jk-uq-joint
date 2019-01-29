import { Mapper } from "./tool/mapper";
//import { Joint } from "./joint";

export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
export type DataPush = (face:string, queue:number, data:any)=>Promise<void>;

//export type UsqInConverter = (settings:Settings, data:any)=>Promise<void>;
export interface UsqIn {
    usq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
}

export interface UsqInTuid extends UsqIn {
    type: 'tuid';
    key: string;
}

export interface UsqInTuidArr extends UsqIn {
    type: 'tuid-arr';
    key: string;
    owner: string;
}

export interface UsqInMap extends UsqIn {
    type: 'map';
}

//export type UsqOutConverter = (settings:Settings, queue:number)=>Promise<{queue:number, data:any}>;
export interface UsqOut {
    usq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
    //push?: DataPush;
}

export interface UsqBus {
    face: string;
    //face: string;
    mapper: Mapper;
    pull?: DataPull;
    push?: DataPush;
}

export interface Settings {
    name: string; // joint name
    unit: number;
    allowedIP: string[];
    usqIns: UsqIn[];
    usqOuts: UsqOut[];
    //pull: {[name:string]: DataPull};
    //push: {[name:string]: DataPush};
    bus?: UsqBus[];
}
