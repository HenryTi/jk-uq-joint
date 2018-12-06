import { map } from "./map";
import { getOpenApi } from "./openApi";

export const consts = {
    unit: 27,
    allowedIP: [
        '218.249.142.140',
        '211.5.7.60'
    ],
}

export async function saveTuid(tuid:string, no:string, data:any):Promise<number> {
    let openApi = await getOpenApi('JKDev/jkProduct', consts.unit);
    let ret = await openApi.saveTuid(tuid, consts.unit, data);
    let {id, inId, stamp} = ret;
    if (id < 0) id = -id;
    await map(tuid, id, no);
    return stamp;
}
