import * as _ from 'lodash';
import { Joint } from "../../uq-joint";
import { PackType, PackTypeMapToStandard } from "../../settings/in/salesRegion";

export async function PackTypePullWrite(joint: Joint, data: any) {

    try {
        await joint.uqIn(PackType, _.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.uqIn(PackTypeMapToStandard, _.pick(data, ["ID", "StandardUnitID"]));
    } catch (error) {
        console.error(error);
    }
}