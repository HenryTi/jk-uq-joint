import {product, productPack} from './product';
import {packType} from './packType';
import { usqs } from '../usqs';
import { UsqIn, UsqInConverter, UsqInMap } from '../../usq-joint';

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

const _in: {[name:string]: UsqIn | UsqInConverter} = {
    'product': product,
    'product.pack': productPack,
    'packType': packType,
    'price': price,
    'price-2': price2,
}

export default _in;