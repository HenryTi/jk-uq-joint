import { saveTuid } from "../tool/tool";

export async function product(data:any):Promise<number> {
    // tranfer data, no => id
    let no = data['no'] || '333';
    return await saveTuid('product', no, data);
}
