import { UsqOut } from "../../usq-joint";
import { usqs } from '../usqs';

export const order: UsqOut = {
    usq: usqs.jkOrder,
    type: 'sheet',
    entity: 'order',
    key: 'no',
    mapper: {
        $all: true,
    }
};
