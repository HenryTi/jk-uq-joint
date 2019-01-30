"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usqs_1 = require("../usqs");
exports.Country = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'Country',
    key: 'ID',
    mapper: {
        $id: 'ID@Country',
        no: "ID",
        code: "ID",
        englishName: "Countries",
        chineseName: "ChineseName"
    }
};
exports.Province = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'Province',
    key: 'ID',
    mapper: {
        $id: 'ID@Province',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        country: "parentCode@Country",
    }
};
exports.City = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'City',
    key: 'ID',
    mapper: {
        $id: 'ID@City',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        province: "parentCode@Province",
    }
};
exports.County = {
    usq: usqs_1.usqs.jkCommon,
    type: 'tuid',
    entity: 'County',
    key: 'ID',
    mapper: {
        $id: 'ID@County',
        no: "ID",
        englishName: "Countries",
        chineseName: "ChineseName",
        city: "parentCode@City",
    }
};
exports.Address = {
    usq: usqs_1.usqs.jkCommon,
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
//# sourceMappingURL=Address.js.map