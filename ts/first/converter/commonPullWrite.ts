import { Joint } from "../../usq-joint";
import * as _ from 'lodash';

export async function PackTypePullWrite(joint: Joint, data: any) {

    try {
        await joint.pushToUsq("PackType", _.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.pushToUsq("PackTypeMapToStandard", _.pick(data, ["ID", "StandardUnitID"]));
    } catch (error) {
        console.error(error);
    }
}