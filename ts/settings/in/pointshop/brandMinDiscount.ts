import config from 'config';
import { uqs } from "settings/uqs";
import { UqInMap } from "uq-joint";

const promiseSize = config.get<number>("promiseSize");

export const BrandMinDiscount: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'BrandMinDiscount',
    mapper: {
        brand: 'MCode@Brand',
        discount: 'Discount',
        isValid: 'Active',
    },
};