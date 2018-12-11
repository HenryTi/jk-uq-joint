import { UsqIn } from "../../usq-joint";
import { usqs } from '../usqs';

export const product: UsqIn = {
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
