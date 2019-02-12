import { UqIn, UqInTuid, UqInTuidArr } from "../../uq-joint";
import { us } from '../uqs';

export const product: UqInTuid = {
    uq: us.jkProduct,
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
    uq: us.jkProduct,
    type: 'tuid-arr',
    entity: 'product.pack',
    key: 'no',
    owner: 'prodNo',
    mapper: {
        ratio: true,
        name: true,
    }
}
