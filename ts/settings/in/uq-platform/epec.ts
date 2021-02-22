import { uqs } from "settings/uqs";
import { UqInMap, UqInTuid } from "uq-joint";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const EpecUser: UqInMap = {
    uq: uqs.jkPlatformJoint,
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

export const EpecProvince: UqInTuid = {
    uq: uqs.jkPlatformJoint,
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


export const EpecCity: UqInTuid = {
    uq: uqs.jkPlatformJoint,
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

export const EpecCounty: UqInTuid = {
    uq: uqs.jkPlatformJoint,
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

export const EpecProvinceMapping: UqInMap = {
    uq: uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecProvinceMapping',
    mapper: {
        province: 'province@Province',
        arr1: {
            epecProvince: '^epecProvince@EpecProvince',
        }
    }
};

export const EpecCityMapping: UqInMap = {
    uq: uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecCityMapping',
    mapper: {
        city: 'city@City',
        arr1: {
            epecCity: '^epecCity@EpecCity',
        }
    }
};

export const EpecCountyMapping: UqInMap = {
    uq: uqs.jkPlatformJoint,
    type: 'map',
    entity: 'EpecCountyMapping',
    mapper: {
        county: 'county@County',
        arr1: {
            epecCounty: '^epecCounty@EpecCounty',
        }
    }
};