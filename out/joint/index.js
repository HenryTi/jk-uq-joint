"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import { Runner, getRunner } from '../../db';
//import { consts } from '../../core';
//import { writeDataToBus } from '../../queue/processBusMessage';
const getIp_1 = require("./getIp");
const readBus_1 = require("./readBus");
const writeBus_1 = require("./writeBus");
const allowedIP = '';
const unit = 24;
exports.router = express_1.Router({ mergeParams: true });
exports.router.get('/', async (req, res) => {
    await routerProcess(req, res, readBus_1.readBus);
});
exports.router.post('/', async (req, res) => {
    await routerProcess(req, res, writeBus_1.writeBus);
});
async function routerProcess(req, res, action) {
    try {
        let reqIP = getIp_1.getClientIp(req);
        let innerIP = getIp_1.getIp(req);
        let netIP = getIp_1.getNetIp(req);
        if (getIp_1.validIp(allowedIP, [innerIP, netIP]) === false) {
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