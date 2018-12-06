import { saveTuid } from "../tool/tool";
import { map } from "../tool/map";

export async function product(data:any) {
    let no = data['no'] || '333';
    let id = await saveTuid('product', data);
    await map('product', id||22, no);
}
