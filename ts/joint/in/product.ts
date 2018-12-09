import { UsqIn, usqs } from "../defines";

export const product: UsqIn = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'product',
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
