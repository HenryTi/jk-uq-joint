import { Settings } from "../uq-joint";
//import _out from "./out";
//import pull from "./pull";
import { bus } from "./bus";
import uqIns from "./in";
//import push from "./push";

export const settings: Settings = {
    name: 'j&k_uq_joint',
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    uqIns: uqIns,
    uqOuts: undefined,
    //out: _out,
    //pull: pull,
    //push: push,
    bus: bus,
}
