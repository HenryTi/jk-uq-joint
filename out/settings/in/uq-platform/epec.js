"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpecCountyMapping = exports.EpecCityMapping = exports.EpecProvinceMapping = exports.EpecCounty = exports.EpecCity = exports.EpecProvince = exports.EpecUser = void 0;
const uqs_1 = require("settings/uqs");
const config_1 = __importDefault(require("config"));
const promiseSize = config_1.default.get("promiseSize");
exports.EpecUser = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecUser',
    mapper: {
        webUser: "WebUserId@WebUser",
        username: "UserName",
        organizationId: "OrganizationId",
        organizationName: "OrganizationName",
        mobile: "Mobile",
        email: "Email",
        isAdmin: "IsAdmin",
    },
    pull: `select top ${promiseSize} ID, CIID as WebUserId, epecUserName as UserName, 
                epecOrganizationId as OrganizationId, OrganizationName, Mobile, Email, IsAdmin
            from alidb.jk_eb.dbo.epec_user
            where ID > @iMaxId
            order by ID`,
};
exports.EpecProvince = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'tuid',
    entity: 'EpecProvince',
    key: 'ID',
    mapper: {
        $id: 'ID@EpecProvince',
        code: "ID",
        englishName: false,
        chineseName: "Name",
        country: 196,
        isValid: 1,
        order: 0,
    }
};
exports.EpecCity = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'tuid',
    entity: 'EpecCity',
    key: 'ID',
    mapper: {
        $id: 'ID@EpecCity',
        code: "ID",
        englishName: false,
        chineseName: "Name",
        province: "ParentId@EpecProvince",
        isValid: 1,
        order: 0,
    }
};
exports.EpecCounty = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'tuid',
    entity: 'EpecCounty',
    key: 'ID',
    mapper: {
        $id: 'ID@EpecCounty',
        code: "ID",
        englishName: false,
        chineseName: "Name",
        city: "ParentId@EpecCity",
        isValid: 1,
        order: 0,
    }
};
exports.EpecProvinceMapping = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecProvinceMapping',
    mapper: {
        province: 'province@Province',
        arr1: {
            epecProvince: '^epecProvince@EpecProvince',
        }
    }
};
exports.EpecCityMapping = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecCityMapping',
    mapper: {
        city: 'city@City',
        arr1: {
            epecCity: '^epecCity@EpecCity',
        }
    }
};
exports.EpecCountyMapping = {
    uq: uqs_1.uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecCountyMapping',
    mapper: {
        county: 'county@County',
        arr1: {
            epecCounty: '^epecCounty@EpecCounty',
        }
    }
};
//# sourceMappingURL=epec.js.map