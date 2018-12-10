"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapData_1 = require("./mapData");
const map_1 = require("./map");
const openApi_1 = require("./openApi");
const settings_1 = require("../settings");
async function mapFromSheet(usqOut, queue) {
    let { usq, entity, key, mapper } = usqOut;
    let openApi = await openApi_1.getOpenApi(usq, settings_1.settings.unit);
    let sheet = await openApi.scanSheet(entity, queue);
    if (sheet === undefined)
        return;
    let { id } = sheet;
    let mapFromUsq = new mapData_1.MapFromUsq();
    let body = await mapFromUsq.map(sheet, mapper);
    let keyVal = 'usq-' + id;
    body[key] = keyVal;
    await map_1.map(entity, id, keyVal);
    return { queue: id, data: body };
    //await execProc('write_queue_out', [outName, JSON.stringify(body)]);
}
exports.mapFromSheet = mapFromSheet;
//# sourceMappingURL=mapFromSheet.js.map