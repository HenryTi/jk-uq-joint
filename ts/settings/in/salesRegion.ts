import { UqInTuid, UqInMap } from "uq-joint";
import { uqs } from "../uqs";

export const SalesRegion: UqInTuid = {
    uq: uqs.jkCommon,
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

export const Currency: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Currency',
    key: 'ID',
    mapper: {
        $id: 'ID@Currency',
        name: "ID",
    }
};

export const PackType: UqInTuid = {
    uq: uqs.jkCommon,
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

export const PackTypeMapToStandard: UqInMap = {
    uq: uqs.jkCommon,
    type: 'map',
    entity: "PackTypeMapToStandard",
    mapper: {
        packType: "ID@PackType",
        arr1: {
            packTypeStandard: "StandardUnitID@PackTypeStandard",
        }
    }
};

export const PackTypeStandard: UqInTuid = {
    uq: uqs.jkCommon,
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

export const Language: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'Language',
    key: 'ID',
    mapper: {
        $id: 'ID@Language',
        no: "ID",
        description: 'LanguageStr',
    }
};

export const InvoiceType: UqInTuid = {
    uq: uqs.jkCommon,
    type: 'tuid',
    entity: 'InvoiceType',
    key: 'ID',
    mapper: {
        $id: 'ID@InvoiceType',
        description: 'Description',
    }
};
