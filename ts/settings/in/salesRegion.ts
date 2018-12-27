import { UsqInTuid, UsqInMap } from "../../usq-joint";
import { usqs } from "../usqs";

export const SalesRegion: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'SalesRegion',
    key: 'ID',
    mapper: {
        $id: 'ID@SalesRegion',
        no: "ID",
        name: "market_name",
        currency: "currency@Currency",
    }
};

export const Currency: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'Currency',
    key: 'ID',
    mapper: {
        $id: 'ID@Currency',
        name: "ID",
    }
};

export const PackType: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'PackType',
    key: 'ID',
    mapper: {
        $id: 'ID@PackType',
        no: 'ID',
        name: 'unitE',
        description: "unitC"
    }
};

export const PackTypeMapToStandard: UsqInMap = {
    usq: usqs.jkCommon,
    type: 'map',
    entity: "PackTypeMapToStandard",
    mapper: {
        packType: "ID@PackType",
        arr1: {
            packTypeStandard: "standardUnitID@PackTypeStandard",
        }
    }
};

export const PackTypeStandard: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'PackTypeStandard',
    key: 'ID',
    mapper: {
        $id: 'ID@PackTypeStandard',
        no: "ID",
        name: 'unit',
        class: "name"
    }
};

export const Lanugage: UsqInTuid = {
    usq: usqs.jkCommon,
    type: 'tuid',
    entity: 'Language',
    key: 'ID',
    mapper: {
        $id: 'ID@Language',
        no: "ID",
        description: 'LanguageStr',
    }
};
