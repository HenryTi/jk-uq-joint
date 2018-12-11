"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const fetch_1 = require("./fetch");
const centerHost = config_1.default.get('centerhost');
const centerUrl = urlSetCenterHost(config_1.default.get('center'));
function urlSetCenterHost(url) {
    return url.replace('://centerhost/', '://' + centerHost + '/');
}
exports.urlSetCenterHost = urlSetCenterHost;
class CenterApi extends fetch_1.Fetch {
    constructor() {
        super(centerUrl);
    }
    async busSchema(owner, bus) {
        let ret = await this.get('open/bus', { owner: owner, bus: bus });
        return ret.schema;
    }
    async serviceBus(serviceUID, serviceBuses) {
        await this.post('open/save-service-bus', {
            service: serviceUID,
            bus: serviceBuses,
        });
    }
    async unitx(unit) {
        return await this.get('open/unitx', { unit: unit });
    }
    async usqUrl(unit, usq) {
        return await this.get('open/usq-url', { unit: unit, usq: usq });
    }
    async urlFromUsq(unit, usqFullName) {
        return await this.get('open/url-from-usq', { unit: unit, usq: usqFullName });
    }
    async usqlDb(name) {
        return await this.get('open/usqldb', { name: name });
    }
    async pushTo(msg) {
        return await this.post('push', msg);
    }
    async unitxBuses(unit, busOwner, bus, face) {
        return await this.get('open/unitx-buses', { unit: unit, busOwner: busOwner, bus: bus, face: face });
    }
}
exports.centerApi = new CenterApi();
//# sourceMappingURL=centerApi.js.map