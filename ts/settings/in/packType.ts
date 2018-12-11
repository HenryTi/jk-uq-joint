import { UsqIn } from "../../usq-joint";
import { usqs } from '../usqs';

export const packType: UsqIn = {
    usq: usqs.jkProduct,
    type: 'tuid',
    entity: 'packType',
    key: 'no',
    mapper: {
        discription: 'discription',
        packType: 'packType@packType',
        a: false,
        b: true,
        c: true,
    }
};
