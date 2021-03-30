import { uqs } from "../../../settings/uqs";
import { UqInTuid } from "uq-joint";

export const JNKRestrict: UqInTuid = {
    uq: uqs.jkChemicalSecurity,
    type: 'tuid',
    entity: 'JNKRestrict',
    key: 'JNKRestrictID',
    mapper: {
        $id: 'JNKRestrictID@JNKRestrict',
        no: "JNKRestrictID",
        description: "Description",
    },
}