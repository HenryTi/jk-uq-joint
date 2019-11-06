import { UqInTuid } from "../../uq-joint";
import { uqs } from "../uqs";

export const Country: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Country',
    key: 'ID',
    mapper: {
        $id: 'ID@Country',
        no: "ID",
        code: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        isValid: 'IsValid',
        order: 'Order',
    }
};


export const Province: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Province',
    key: 'ID',
    mapper: {
        $id: 'ID@Province',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        country: "parentCode@Country",
        isValid: 'IsValid',
        order: 'Order',
    }
};


export const City: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'City',
    key: 'ID',
    mapper: {
        $id: 'ID@City',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        province: "parentCode@Province",
        isValid: 'IsValid',
        order: 'Order',
    }
};

export const County: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'County',
    key: 'ID',
    mapper: {
        $id: 'ID@County',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        city: "parentCode@City",
        isValid: 'IsValid',
        order: 'Order',
    }
};

export const Address: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Address',
    key: 'ID',
    mapper: {
        $id: 'ID@Address',
        country: "CountryID@Country",
        province: "ProvinceID@Province",
        city: "CityID@City",
        county: "CountyID@County",
        description: "Description",
    }
};