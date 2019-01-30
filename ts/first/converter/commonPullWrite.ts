import { Joint } from "../../usq-joint";
import * as _ from 'lodash';
import { PackType, PackTypeMapToStandard } from "../../settings/in/salesRegion";

export async function PackTypePullWrite(joint: Joint, data: any) {

    try {
        await joint.usqIn(PackType, _.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.usqIn(PackTypeMapToStandard, _.pick(data, ["ID", "StandardUnitID"]));
    } catch (error) {
        console.error(error);
    }
}