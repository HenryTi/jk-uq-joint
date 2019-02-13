import { UqIn, UqInTuid } from "../../uq-joint";
import { uqs } from '../uqs';

export const packType: UqInTuid = {
    uq: uqs.jkProduct,
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
