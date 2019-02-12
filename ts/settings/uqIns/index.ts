import {product, productPack} from './product';
import {packType} from './packType';
import { us } from '../uqs';
import { UqIn, UqInMap } from '../../uq-joint';

const price: UqInMap = {
    uq: us.jkProduct,
    type: 'map',
    entity: 'price',
    mapper: {
        product: '@product',
        arr1: {
            pack: '@product.pack',
            retail: true,
        }
    }
}

/*
const price2: UqInMap = {
    uq: uqs.jkProduct,
    type: 'map',
    entity: 'price',
    mapper: {
        product: '@product',
        arr1: {
            packType: '^@packType',
            retail: '^',
        }
    }
}
*/

const _in: UqIn[] = [
    product,
    productPack,
    packType,
    price,
    //'price-2': price2,
];

export default _in;