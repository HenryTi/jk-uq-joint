import { Settings } from "../usq-joint";
//import _out from "./out";
//import pull from "./pull";
import { bus } from "./bus";
import usqIns from "./in";
//import push from "./push";

export const settings: Settings = {
    name: 'j&k_usq_joint',
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    usqIns: usqIns,
    usqOuts: undefined,
    //out: _out,
    //pull: pull,
    //push: push,
    bus: bus,
}
