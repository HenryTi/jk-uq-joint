import { product } from './product';
import { Mapper } from '../tool/mapper';

export const inputs:{[moniker:string]: Mapper | ((data:any)=>Promise<number>)} = {
    "product": product,
}
