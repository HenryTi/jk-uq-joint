"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqls_1 = require("./converter/sqls");
const Address_1 = require("../settings/in/Address");
const chemical_1 = require("../settings/in/chemical");
/** */
exports.pulls = [
    /*
    { read: sqls.readLanguage, uqIn: Language },
    { read: sqls.readCountry, uqIn: Country },
    { read: sqls.readProvince, uqIn: Province },
    { read: sqls.readCity, uqIn: City },
    */
    { read: sqls_1.sqls.readCounty, uqIn: Address_1.County },
    /*
    { read: sqls.readPackTypeStandard, uqIn: PackTypeStandard },
    { read: sqls.readPackType, uqIn: PackTypePullWrite },
    { read: sqls.readCurrency, uqIn: Currency },
    { read: sqls.readSalesRegion, uqIn: SalesRegion },
    */
    { read: sqls_1.sqls.readChemical, uqIn: chemical_1.Chemical },
];
//# sourceMappingURL=pulls.js.map