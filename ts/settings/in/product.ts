import { UsqIn, UsqInTuid, UsqInTuidArr } from "../../usq-joint";
import { usqs } from '../usqs';

export const product: UsqInTuid = {
    usq: usqs.jkProduct,
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

export const productPack: UsqInTuidArr = {
    usq: usqs.jkProduct,
    type: 'tuid-arr',
    entity: 'product.pack',
    key: 'no',
    owner: 'prodNo',
    mapper: {
        ratio: true,
        name: true,
    }
}
