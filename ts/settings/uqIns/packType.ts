import { UqIn, UqInTuid } from "../../uq-joint";
import { us } from '../uqs';

export const packType: UqInTuid = {
    uq: us.jkProduct,
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
