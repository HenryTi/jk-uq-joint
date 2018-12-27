import { UsqInTuid } from "../../usq-joint";
import { usqs } from "../usqs";

export const Country: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'Country',
    key: 'ID',
    mapper: {
        $id: 'ID@Country',
        no: "ID",
        code: "ID",
        englishName: "countries",
        chineseName: "ChineseName"
    }
};


export const Province: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'Province',
    key: 'ID',
    mapper: {
        $id: 'ID@Province',
        no: "ID",
        englishName: "countries",
        chineseName: "ChineseName",
        country: "parentCode@Country",
    }
};


export const City: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'City',
    key: 'ID',
    mapper: {
        $id: 'ID@City',
        no: "ID",
        englishName: "countries",
        chineseName: "ChineseName",
        province: "parentCode@Province",
    }
};

export const County: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'County',
    key: 'ID',
    mapper: {
        $id: 'ID@County',
        no: "ID",
        englishName: "countries",
        chineseName: "ChineseName",
        city: "parentCode@City",
    }
};

export const Address: UsqInTuid = {
    usq: usqs.jkCommon,
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