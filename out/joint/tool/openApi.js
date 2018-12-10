"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetch_1 = require("./fetch");
const centerApi_1 = require("./centerApi");
const setHostUrl_1 = require("./setHostUrl");
const settings_1 = require("../settings");
class OpenApi extends fetch_1.Fetch {
    appendHeaders(headers) {
        headers.append('unit', String(settings_1.settings.unit));
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
    async getTuidVId(tuid) {
        let ret = await this.get('joint/tuid-vid/' + tuid);
        return ret;
    }
    async scanSheet(sheet, scanStartId) {
        let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
        return ret;
    }
}
exports.OpenApi = OpenApi;
const usqOpenApis = {};
async function getOpenApi(usqFullName, unit) {
    let openApis = usqOpenApis[usqFullName];
    if (openApis === null)
        return null;
    if (openApis === undefined) {
        usqOpenApis[usqFullName] = openApis = {};
    }
    let usqUrl = await centerApi_1.centerApi.urlFromUsq(unit, usqFullName);
    if (usqUrl === undefined)
        return openApis[unit] = null;
    let { url, urlDebug } = usqUrl;
    if (urlDebug !== undefined) {
        try {
            urlDebug = setHostUrl_1.urlSetUsqHost(urlDebug);
            urlDebug = setHostUrl_1.urlSetUnitxHost(urlDebug);
            let ret = await node_fetch_1.default(urlDebug + 'hello');
            if (ret.status !== 200)
                throw 'not ok';
            let text = await ret.text();
            url = urlDebug;
        }
        catch (err) {
        }
    }
    return openApis[unit] = new OpenApi(url);
}
exports.getOpenApi = getOpenApi;
//# sourceMappingURL=openApi.js.map