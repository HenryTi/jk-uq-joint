"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("config"));
exports.isDevelopment = process.env.NODE_ENV === 'development';
const centerHost = config_1.default.get('centerhost');
const centerDebugHost = 'localhost:3000'; //'192.168.86.64';
const uqDebugHost = 'localhost:3015'; //'192.168.86.63';
const debugUqBuilder = 'localhost:3009';
function tryConfig(name) {
    if (config_1.default.has(name) === false)
        return;
    return config_1.default.get(name);
}
const hosts = {
    centerhost: {
        value: tryConfig('debug-centerhost') || centerDebugHost,
        local: false
    },
    uqhost: {
        value: tryConfig('debug-uqhost') || uqDebugHost,
        local: false
    },
    unitxhost: {
        value: tryConfig('debug-unitxhost') || uqDebugHost,
        local: false
    },
    "uq-build": {
        value: tryConfig('debug-uq-serverhost') || debugUqBuilder,
        local: false
    }
};
function centerUrlFromHost(host) { return `http://${host}/tv/`; }
function centerWsFromHost(host) { return `ws://${host}/tv/`; }
class Host {
    //ws: string;
    async start() {
        if (exports.isDevelopment === true) {
            await this.tryLocal();
        }
        let host = this.getCenterHost();
        this.centerUrl = centerUrlFromHost(host);
        //this.ws = centerWsFromHost(host);
    }
    debugHostUrl(host) { return `http://${host}/hello`; }
    async tryLocal() {
        let promises = [];
        for (let i in hosts) {
            let hostValue = hosts[i];
            let { value } = hostValue;
            //let host = process.env[env] || value;
            let fetchUrl = this.debugHostUrl(value);
            let fetchOptions = {
                method: "GET",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
            };
            promises.push(localCheck(fetchUrl, fetchOptions));
        }
        let results = await Promise.all(promises);
        let p = 0;
        for (let i in hosts) {
            let hostValue = hosts[i];
            hostValue.local = results[p];
            ++p;
        }
    }
    getCenterHost() {
        let { value, local } = hosts.centerhost;
        if (exports.isDevelopment === true) {
            if (local === true)
                return value;
        }
        return centerHost;
    }
    getUrlOrDebug(url, urlDebug) {
        if (exports.isDevelopment !== true)
            return url;
        if (!urlDebug)
            return url;
        for (let i in hosts) {
            let host = hosts[i];
            let { value, local } = host;
            let hostString = `://${i}/`;
            let pos = urlDebug.indexOf(hostString);
            if (pos > 0) {
                if (local === false)
                    break;
                urlDebug = urlDebug.replace(hostString, `://${value}/`);
                return urlDebug;
            }
        }
        return url;
    }
}
exports.host = new Host();
// 因为测试的都是局域网服务器，甚至本机服务器，所以一秒足够了
// 网上找了上面的fetch timeout代码。
// 尽管timeout了，fetch仍然继续，没有cancel
// 实际上，一秒钟不够。web服务器会自动停。重启的时候，可能会比较长时间。也许两秒甚至更多。
//const timeout = 2000;
const timeout = 100;
function fetchLocalCheck(url, options) {
    return new Promise((resolve, reject) => {
        node_fetch_1.default(url, options)
            .then(v => {
            v.text().then(resolve).catch(reject);
        })
            .catch(reject);
        const e = new Error("Connection timed out");
        setTimeout(reject, timeout, e);
    });
}
async function localCheck(url, options) {
    try {
        await fetchLocalCheck(url, options);
        return true;
    }
    catch (_a) {
        return false;
    }
}
//# sourceMappingURL=host.js.map