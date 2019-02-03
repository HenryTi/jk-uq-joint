"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("../tool/fetch");
const centerApi_1 = require("../tool/centerApi");
const host_1 = require("../tool/host");
const $unitx = '$$$/$unitx';
class Usqs {
    constructor(unit) {
        this.usqs = {};
        this.unit = unit;
    }
    async getUsq(usqFullName) {
        let usq = this.usqs[usqFullName];
        if (usq !== undefined)
            return usq;
        return this.usqs[usqFullName] = await this.createUsq(usqFullName);
    }
    async createUsq(usqFullName) {
        let usq = new Usq(this, usqFullName, this.unit);
        await usq.initBuild();
        this.usqs[usqFullName] = usq;
        return usq;
    }
    async init() {
        this.unitx = new UsqUnitx(this, $unitx, this.unit);
        await this.unitx.initBuild();
    }
    async readBus(face, queue) {
        return await this.unitx.readBus(face, queue);
    }
    async writeBus(face, source, newQueue, body) {
        await this.unitx.writeBus(face, source, newQueue, body);
    }
}
exports.Usqs = Usqs;
class Usq {
    constructor(usqs, usqFullName, unit) {
        this.usqs = usqs;
        this.usqFullName = usqFullName;
        this.unit = unit;
    }
    async initOpenApi() {
        let usqUrl = await centerApi_1.centerApi.urlFromUsq(this.unit, this.usqFullName);
        if (usqUrl === undefined)
            return;
        let { url, urlDebug } = usqUrl;
        url = await host_1.host.getUrlOrDebug(url, urlDebug);
        this.openApi = new OpenApi(url, this.unit);
    }
    async initBuild() {
        await this.initOpenApi();
    }
    async buildData(data, props) {
    }
    async saveTuid(tuid, body) {
        return await this.openApi.saveTuid(tuid, body);
    }
    async saveTuidArr(tuid, tuidArr, ownerId, body) {
        return await this.openApi.saveTuidArr(tuid, tuidArr, ownerId, body);
    }
    async getTuidVId(ownerEntity) {
        return await this.openApi.getTuidVId(ownerEntity);
    }
    async setMap(map, body) {
        await this.openApi.setMap(map, body);
    }
    async delMap(map, body) {
        await this.openApi.delMap(map, body);
    }
}
class UsqUnitx extends Usq {
    async readBus(face, queue) {
        return await this.openApi.readBus(face, queue);
    }
    async writeBus(face, source, newQueue, body) {
        await this.openApi.writeBus(face, source, newQueue, body);
    }
}
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
    async getTuidVId(tuid) {
        let parts = tuid.split('.');
        let url;
        if (parts.length === 1)
            url = `joint/tuid-vid/${tuid}`;
        else
            url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
        let ret = await this.get(url);
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
}
//# sourceMappingURL=usq.js.map