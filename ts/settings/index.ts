import config from 'config';

import { Settings } from "uq-joint";
//import _out from "./out";
//import pull from "./pull";
import { bus } from "./bus";
import uqIns from "./in";
import { uqPullRead, readMany, uqOutRead } from "../first/converter/uqOutRead";
//import push from "./push";

const uqInEntities = config.get<{ name: string, intervalUnit: number }[]>("afterFirstEntities");
const uqBusSettings = config.get<string[]>("uqBus");
const interval = config.get<number>("interval");


export const settings: Settings = {
    name: 'j&k_uq_joint',
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    uqIns: uqIns,
    uqOuts: undefined,

    uqInEntities: uqInEntities,
    uqBusSettings: uqBusSettings,
    scanInterval: interval,

    //out: _out,
    //pull: pull,
    //push: push,
    bus: bus,
    // pullReadFromSql: uqPullRead
    pullReadFromSql: uqOutRead
}
