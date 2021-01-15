import { Joint, MapUserToUq, UqIn } from "uq-joint";
import _ from 'lodash';
import { StorageCondition } from "../../settings/in/chemical";

export async function StorageConditionPullWrite(joint: Joint, uqIn: UqIn, data: any): Promise<boolean> {

    try {

        await joint.uqIn(StorageCondition, _.pick(data, ["ID", "CodeST", "DescriptionST"]));
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}