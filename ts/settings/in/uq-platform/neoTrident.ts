import { uqs } from "settings/uqs";
import { UqInMap } from "uq-joint";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const NeoTridentUser: UqInMap = {
    uq: uqs.jkPlatformJoint,
    type: 'map',
    entity: 'NeoTridentUser',
    mapper: {
        webUser: "WebUserId@WebUser",
        username: "UserName",
        organization: "Organization",
        team: "SharedSecretTeamID",
        sharedSecret: "SharedSecret",
    }
};