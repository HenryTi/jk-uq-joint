import fetch, { Headers } from "node-fetch";
import { Fetch } from "./fetch";
import { centerApi } from "./centerApi";
import { urlSetUsqHost, urlSetUnitxHost } from "./setHostUrl";
import { settings } from "../settings";

export class OpenApi extends Fetch {
    protected appendHeaders(headers:Headers) {
        headers.append('unit', String(settings.unit));
    }

    async fresh(unit:number, stamps:any):Promise<any> {
        let ret = await this.post('open/fresh', {
            unit: unit,
            stamps: stamps
        });
        return ret;
    }
    async bus(faces:string, faceUnitMessages:string) {
        let ret = await this.post('open/bus', {
            faces: faces,
            faceUnitMessages: faceUnitMessages,
        });
        return ret;
    }
    async tuid(unit: number, id: number, tuid:string, maps: string[]):Promise<any> {
        let ret = await this.post('open/tuid', {
            unit: unit,
            id: id,
            tuid: tuid,
            maps: maps,
        });
        return ret;
    }
    async saveTuid(tuid:string, data:any):Promise<any> {
        let ret = await this.post('joint/tuid/' + tuid, data);
        return ret;
    }
    async getTuidVId(tuid:string):Promise<number> {
        let ret = await this.get('joint/tuid-vid/' + tuid);
        return ret;
    }
}

const usqOpenApis: {[usqFullName:string]: {[unit:number]:OpenApi}} = {};
export async function getOpenApi(usqFullName:string, unit:number):Promise<OpenApi> {
    let openApis = usqOpenApis[usqFullName];
    if (openApis === null) return null;
    if (openApis === undefined) {
        usqOpenApis[usqFullName] = openApis = {};
    }
    let usqUrl = await centerApi.urlFromUsq(unit, usqFullName);
    if (usqUrl === undefined) return openApis[unit] = null;
    let {url, urlDebug} = usqUrl;
    if (urlDebug !== undefined) {
        try {
            urlDebug = urlSetUsqHost(urlDebug);
            urlDebug = urlSetUnitxHost(urlDebug);
            let ret = await fetch(urlDebug + 'hello');
            if (ret.status !== 200) throw 'not ok';
            let text = await ret.text();
            url = urlDebug;
        }
        catch (err) {
        }
    }
    return openApis[unit] = new OpenApi(url);
}
