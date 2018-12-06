import { product } from './product';

export const inputs:{[moniker:string]: (data:any)=>Promise<void>} = {
    "product": product,
}
