import { Mapper } from "./tool/mapper";
import { Joint } from "./joint";
import { UqProp } from "./uq/uq";

export type DataPull<T> = (joint:Joint, uqIn:T, queue:number)=>Promise<{queue:number, data:any}>;
export type PullWrite = (joint:Joint, data:any) => Promise<boolean>;
export type DataPush<T> = (joint:Joint, uqIn:T, queue:number, data:any)=>Promise<boolean>;

export interface UqIn {
    uq: string;
    entity: string;
    type: 'tuid' | 'tuid-arr' | 'map';
    mapper: Mapper;
    pull?: DataPull<UqIn> | string;
    pullWrite?: PullWrite;
    firstPullWrite?: PullWrite;
    push?: DataPush<UqIn>;
}

export interface UqInTuid extends UqIn {
    type: 'tuid';
    key: string;
    pull?: DataPull<UqInTuid> | string;
    push?: DataPush<UqInTuid>;
}

export interface UqInTuidArr extends UqIn {
    type: 'tuid-arr';
    key: string;
    owner: string;
    pull?: DataPull<UqInTuidArr> | string;
    push?: DataPush<UqInTuidArr>;
}

export interface UqInMap extends UqIn {
    type: 'map';
    pull?: DataPull<UqInMap> | string;
    push?: DataPush<UqInMap>;
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
    pull?: DataPull<UqBus>;
    push?: DataPush<UqBus>;
    uqIdProps?: {[name:string]: UqProp}; //{contact: {tuid: 'contact'}}
}

export interface Settings {
    name: string;
    unit: number;
    allowedIP: string[];
    uqIns: UqIn[];
    uqOuts: UqOut[];
    bus?: UqBus[];
    pullReadFromSql?: (sql: string, queue: number) => Promise<{ queue: number, data: any }>;
}
