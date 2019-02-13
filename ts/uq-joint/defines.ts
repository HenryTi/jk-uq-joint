import { Mapper } from "./tool/mapper";
import { Joint } from "./joint";
import { UqProp } from "./uq/uq";

export type DataPull = (joint:Joint, face:string, queue:number)=>Promise<{queue:number, data:any}>;
export type DataPush = (joint:Joint, face:string, queue:number, data:any)=>Promise<boolean>;

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

export interface UqOut {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
    //push?: DataPush;
}

export interface UqBus {
    face: string;
    mapper: Mapper;
    pull?: DataPull;
    push?: DataPush;
    uqIdProps?: {[name:string]: UqProp}; //{contact: {tuid: 'contact'}}
}

export interface Settings {
    name: string;
    unit: number;
    allowedIP: string[];
    uqIns: UqIn[];
    uqOuts: UqOut[];
    bus?: UqBus[];
}
