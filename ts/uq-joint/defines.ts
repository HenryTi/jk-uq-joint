import { Mapper } from "./tool/mapper";
//import { Joint } from "./joint";

export type DataPull = (face:string, queue:number)=>Promise<{queue:number, data:any}>;
export type DataPush = (face:string, queue:number, data:any)=>Promise<boolean>;

//export type UqInConverter = (settings:Settings, data:any)=>Promise<void>;
export interface UqIn {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
}

export interface UqInTuid extends UqIn {
    type: 'tuid';
    key: string;
}

export interface UqInTuidArr extends UqIn {
    type: 'tuid-arr';
    key: string;
    owner: string;
}

export interface UqInMap extends UqIn {
    type: 'map';
}

//export type UqOutConverter = (settings:Settings, queue:number)=>Promise<{queue:number, data:any}>;
export interface UqOut {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
    //push?: DataPush;
}

export interface UqBus {
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
    uqIns: UqIn[];
    uqOuts: UqOut[];
    //pull: {[name:string]: DataPull};
    //push: {[name:string]: DataPush};
    bus?: UqBus[];
}
