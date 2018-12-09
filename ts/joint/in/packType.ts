import { UsqIn, usqs } from "../defines";

export const packType: UsqIn = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'packType',
    key: 'no',
    mapper: {
        // $import: 'all',
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    }
};
