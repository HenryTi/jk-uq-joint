"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("config"));
const uq_joint_1 = require("uq-joint");
const settings_1 = require("./settings");
(async function () {
    console.log(process.env.NODE_ENV);
    //await host.start();
    //centerApi.initBaseUrl(host.centerUrl);
    let connection = config_1.default.get("mysqlConn");
    if (connection === undefined || connection.host === '0.0.0.0') {
        console.log("mysql connection must defined in config/default.json or config/production.json");
        return;
    }
    //await initMssqlPool();
    let app = express_1.default();
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    app.use(bodyParser.json());
    app.use(cors_1.default());
    app.set('json replacer', (key, value) => {
        if (value === null)
            return undefined;
        return value;
    });
    app.use(async (req, res, next) => {
        let s = req.socket;
        let p = '';
        if (req.method !== 'GET')
            p = JSON.stringify(req.body);
        console.log('%s:%s - %s %s %s', s.remoteAddress, s.remotePort, req.method, req.originalUrl, p);
        try {
            await next();
        }
        catch (e) {
            console.error(e);
        }
    });
    let joint = new uq_joint_1.Joint(settings_1.settings, config_1.default.get('jointMode'));
    app.use('/joint-uq-jk', joint.createRouter());
    let port = config_1.default.get('port');
    app.listen(port, async () => {
        console.log('jk-uq-joint listening on port ' + port);
        let { host, user } = connection;
        console.log('process.env.NODE_ENV: %s\nDB host: %s, user: %s', process.env.NODE_ENV, host, user);
        await joint.start();
    });
})();
//# sourceMappingURL=index.js.map