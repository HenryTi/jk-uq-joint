import { saveTuid } from "../tool/tool";

export async function product(data:any) {
    // tranfer data, no => id
    let no = data['no'] || '333';
    await saveTuid('product', no, data);
}
