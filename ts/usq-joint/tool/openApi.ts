import fetch, { Headers } from "node-fetch";
import { Fetch } from "./fetch";
import { centerApi } from "./centerApi";
//import { urlSetUsqHost, urlSetUnitxHost } from "./setHostUrl";
import { host } from './host';

export interface BusMessage {
    id: number;
    face: string;
    from: string;
    body: string;
}

export class OpenApi extends Fetch {
    protected unit:number;
    constructor(baseUrl:string, unit:number) {
        super(baseUrl);
        this.unit = unit;
    }

    protected appendHeaders(headers:Headers) {
        headers.append('unit', String(this.unit));
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
    async readBus(face:string, queue:number):Promise<BusMessage> {
        let ret = await this.post('open/joint-read-bus', {
            unit: this.unit, 
            face: face, 
            queue: queue
        });
        return ret;
    }
    async writeBus(face:string, from:string, queue:number, body:string):Promise<BusMessage> {
        let ret = await this.post('open/joint-write-bus', {
            unit: this.unit, 
            face: face, 
            from: from,
            sourceId: queue,
            body: body,
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
    async saveTuidArr(tuid:string, arr:string, owner:number, data:any):Promise<any> {
        let ret = await this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
        return ret;
    }
    async getTuidVId(tuid:string):Promise<number> {
        let parts = tuid.split('.');
        let url:string;
        if (parts.length === 1)
            url = `joint/tuid-vid/${tuid}`;
        else
            url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
        let ret = await this.get(url);
        return ret;
    }
    async scanSheet(sheet:string, scanStartId:number):Promise<any> {
        let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
        return ret;
    }
    async action(action:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + action, data);
    }
    async setMap(map:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + map + '$add$', data);
    }
    async delMap(map:string, data:any):Promise<void> {
        await this.post('joint/action-json/' + map + '$del$', data);
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
    url = await host.getUrlOrDebug(url, urlDebug);
    /*
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
    */
    return openApis[unit] = new OpenApi(url, unit);
}
