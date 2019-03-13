"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.SalesRegion = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'SalesRegion',
    key: 'ID',
    mapper: {
        $id: 'ID@SalesRegion',
        no: "ID",
        name: "Market_name",
        currency: "Currency@Currency",
    }
};
exports.Currency = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'Currency',
    key: 'ID',
    mapper: {
        $id: 'ID@Currency',
        name: "ID",
    }
};
exports.PackType = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'PackType',
    key: 'ID',
    mapper: {
        $id: 'ID@PackType',
        no: 'ID',
        name: 'UnitE',
        description: "UnitC"
    }
};
exports.PackTypeMapToStandard = {
    uq: uqs_1.uqs.jkCommon,
    type: 'map',
    entity: "PackTypeMapToStandard",
    mapper: {
        packType: "ID@PackType",
        arr1: {
            packTypeStandard: "StandardUnitID@PackTypeStandard",
        }
    }
};
exports.PackTypeStandard = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'PackTypeStandard',
    key: 'ID',
    mapper: {
        $id: 'ID@PackTypeStandard',
        no: "ID",
        name: 'Unit',
        class: "Name"
    }
};
exports.Language = {
    uq: uqs_1.uqs.jkCommon,
    type: 'tuid',
    entity: 'Language',
    key: 'ID',
    mapper: {
        $id: 'ID@Language',
        no: "ID",
        description: 'LanguageStr',
    }
};
//# sourceMappingURL=salesRegion.js.map