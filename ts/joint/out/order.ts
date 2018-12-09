import { UsqOut, usqs } from "../defines";

export const order: UsqOut = {
    usq: usqs.jkProduct,
    type: 'sheet',
    entity: 'order',
    key: 'no',
    mapper: {
        $all: true,
    }
};
