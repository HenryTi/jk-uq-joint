"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import { Runner, getRunner } from '../../db';
//import { consts } from '../../core';
//import { writeDataToBus } from '../../queue/processBusMessage';
const getIp_1 = require("./getIp");
const busPage_1 = require("./busPage");
const busExchange_1 = require("./busExchange");
const tool_1 = require("./tool/tool");
exports.router = express_1.Router({ mergeParams: true });
exports.router.get('/', async (req, res) => {
    await routerProcess(req, res, busPage_1.busPage);
});
exports.router.post('/', async (req, res) => {
    await routerProcess(req, res, busExchange_1.busExchange);
});
async function routerProcess(req, res, action) {
    try {
        let reqIP = getIp_1.getClientIp(req);
        let innerIP = getIp_1.getIp(req);
        let netIP = getIp_1.getNetIp(req);
        if (getIp_1.validIp(tool_1.consts.allowedIP, [innerIP, netIP]) === false) {
            res.end('<div>Your IP ' + (netIP || innerIP || reqIP) + ' is not valid!</div>');
            return;
        }
        await action(req, res);
    }
    catch (err) {
        res.end('error: ' + err.message);
    }
}
//# sourceMappingURL=index.js.map