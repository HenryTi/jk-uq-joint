import { UqInMap } from "uq-joint";
import { uqs } from "../uqs";

export const OrganizationVIPLevel: UqInMap = {
    uq: uqs.jkVIPCardType,
    type: 'map',
    entity: 'OrganizationVIPLevel',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            vipCardLevel: "^VIPLevel",
        }
    },
};