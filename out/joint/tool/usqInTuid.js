/*
import { settings } from '../../settings';
import { map } from "./map";
import { getOpenApi } from "./openApi";
import { MapToUsq } from './mapData';
import { UsqIn } from '../defines';

export async function usqInTuid(usqIn:UsqIn, data:any):Promise<number> {
    let {key, mapper, usq, entity:tuid} = usqIn;
    let keyVal = data[key];
    if (key === undefined) throw 'key is not defined';
    let mapToUsq = new MapToUsq();
    let body = await mapToUsq.map(data, mapper);
    if (usq === undefined) throw 'tuid ' + tuid + ' not defined';
    let openApi = await getOpenApi(usq, settings.unit);
    let ret = await openApi.saveTuid(tuid, body);
    let {id, inId} = ret;
    if (id < 0) id = -id;
    await map(tuid, id, keyVal);
    return id;
}
*/ 
//# sourceMappingURL=usqInTuid.js.map