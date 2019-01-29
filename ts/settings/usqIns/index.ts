import {product, productPack} from './product';
import {packType} from './packType';
import { usqs } from '../usqs';
import { UsqIn, UsqInMap } from '../../usq-joint';

const price: UsqInMap = {
    usq: usqs.jkProduct,
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
const price2: UsqInMap = {
    usq: usqs.jkProduct,
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

const _in: UsqIn[] = [
    product,
    productPack,
    packType,
    price,
    //'price-2': price2,
];

export default _in;