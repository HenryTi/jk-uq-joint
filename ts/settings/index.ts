import { Settings } from "../usq-joint";
import _in from "./in";
import _out from "./out";
import pull from "./pull";
//import push from "./push";

export const settings:Settings = {
    unit: 24,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
    in: _in,
    out: _out,
    pull: pull,
    //push: push,
}
