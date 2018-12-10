import { MapFromUsq } from "./mapData";
import { UsqOut } from "../defines";
import { map } from "./map";
import { getOpenApi } from "./openApi";
import { settings } from "../settings";

export async function mapFromSheet(usqOut:UsqOut, queue:number):Promise<{queue:number, data:any}> {
    let {usq, entity, key, mapper} = usqOut;
    let openApi = await getOpenApi(usq, settings.unit);
    let sheet = await openApi.scanSheet(entity, queue);
    if (sheet === undefined) return;
    let {id} = sheet;
    let mapFromUsq = new MapFromUsq();
    let body = await mapFromUsq.map(sheet, mapper);
    let keyVal = 'usq-' + id;
    body[key] = keyVal;
    await map(entity, id, keyVal);
    return {queue: id, data: body};
    //await execProc('write_queue_out', [outName, JSON.stringify(body)]);
}
