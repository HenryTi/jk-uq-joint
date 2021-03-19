"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoTridentUser = void 0;
const uqs_1 = require("../../uqs");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.NeoTridentUser = {
    uq: uqs_1.uqs.jkPlatformJoint,
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
//# sourceMappingURL=neoTrident.js.map