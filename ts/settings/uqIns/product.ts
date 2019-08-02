import { UqIn, UqInTuid, UqInTuidArr } from "../../uq-joint";
import { uqs } from '../uqs';

export const product: UqInTuid = {
    uq: uqs.jkProduct,
    type: 'tuid',
    entity: 'product',
    key: 'no',
    mapper: {
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    }
};

export const productPack: UqInTuidArr = {
    uq: uqs.jkProduct,
    type: 'tuid-arr',
    entity: 'product.pack',
    key: 'no',
    owner: 'prodNo',
    mapper: {
        ratio: true,
        name: true,
    }
}
