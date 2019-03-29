"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const centerApi_1 = require("./centerApi");
const host_1 = require("./host");
class OpenApi extends fetch_1.Fetch {
    constructor(baseUrl, unit) {
        super(baseUrl);
        this.unit = unit;
    }
    appendHeaders(headers) {
        headers.append('unit', String(this.unit));
    }
    async fresh(unit, stamps) {
        let ret = await this.post('open/fresh', {
            unit: unit,
            stamps: stamps
        });
        return ret;
    }
    async bus(faces, faceUnitMessages) {
        let ret = await this.post('open/bus', {
            faces: faces,
            faceUnitMessages: faceUnitMessages,
        });
        return ret;
    }
    async readBus(face, queue) {
        let ret = await this.post('open/joint-read-bus', {
            unit: this.unit,
            face: face,
            queue: queue
        });
        return ret;
    }
    async writeBus(face, from, queue, body) {
        let ret = await this.post('open/joint-write-bus', {
            unit: this.unit,
            face: face,
            from: from,
            sourceId: queue,
            body: body,
        });
        return ret;
    }
    async tuid(unit, id, tuid, maps) {
        let ret = await this.post('open/tuid', {
            unit: unit,
            id: id,
            tuid: tuid,
            maps: maps,
        });
        return ret;
    }
    async saveTuid(tuid, data) {
        let ret = await this.post('joint/tuid/' + tuid, data);
        return ret;
    }
    async saveTuidArr(tuid, arr, owner, data) {
        let ret = await this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
        return ret;
    }
    async getTuidVId(tuid, uniqueValue) {
        let parts = tuid.split('.');
        let url;
        if (parts.length === 1)
            url = `joint/tuid-vid/${tuid}`;
        else
            url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
        let ret = await this.get(url, { u: uniqueValue });
        return ret;
    }
    async loadTuidMainValue(tuidName, id, allProps) {
        let ret = await this.post(`open/tuid-main/${tuidName}`, { unit: this.unit, id: id, all: allProps });
        return ret;
    }
    async loadTuidDivValue(tuidName, divName, id, ownerId, allProps) {
        let ret = await this.post(`open/tuid-div/${tuidName}/${divName}`, { unit: this.unit, id: id, ownerId: ownerId, all: allProps });
        return ret;
    }
    async scanSheet(sheet, scanStartId) {
        let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
        return ret;
    }
    async action(action, data) {
        await this.post('joint/action-json/' + action, data);
    }
    async setMap(map, data) {
        await this.post('joint/action-json/' + map + '$add$', data);
    }
    async delMap(map, data) {
        await this.post('joint/action-json/' + map + '$del$', data);
    }
    async loadEntities() {
        return await this.get('open/entities/' + this.unit);
    }
    async schema(entityName) {
        return await this.get('open/entity/' + entityName);
    }
}
exports.OpenApi = OpenApi;
const uqOpenApis = {};
async function getOpenApi(uqFullName, unit) {
    let openApis = uqOpenApis[uqFullName];
    if (openApis === null)
        return null;
    if (openApis === undefined) {
        uqOpenApis[uqFullName] = openApis = {};
    }
    let uqUrl = await centerApi_1.centerApi.urlFromUq(unit, uqFullName);
    if (uqUrl === undefined)
        return openApis[unit] = null;
    let { url, urlDebug } = uqUrl;
    url = await host_1.host.getUrlOrDebug(url, urlDebug);
    return openApis[unit] = new OpenApi(url, unit);
}
exports.getOpenApi = getOpenApi;
//# sourceMappingURL=openApi.js.map