import { saveTuid } from "../tool/tuid";

export async function product(data:any):Promise<number> {
    // tranfer data, no => id
    let key = data['no'] || '333';
    let pk = data['packType'];
    let body = {
        discription: 'kkk',
        packType: {tuid:'packType', val:pk},
    };
    return await saveTuid('product', key, body);
}
