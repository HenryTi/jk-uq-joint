import { Joint } from "uq-joint";
import _ from 'lodash';
import { PackType, PackTypeMapToStandard } from "../../settings/in/salesRegion";

export async function PackTypePullWrite(joint: Joint, data: any): Promise<boolean> {

    try {
        await joint.uqIn(PackType, _.pick(data, ["ID", "UnitE", "UnitC"]));
        await joint.uqIn(PackTypeMapToStandard, _.pick(data, ["ID", "StandardUnitID"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}