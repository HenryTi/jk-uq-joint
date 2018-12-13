import { usqs } from '../usqs';
import { UsqOutSheet } from "../../usq-joint";

export const order: UsqOutSheet = {
    usq: usqs.jkOrder,
    type: 'sheet',
    entity: 'order',
    key: 'no',
    mapper: {
        $all: true,
    }
};
