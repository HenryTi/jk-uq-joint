"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const uq_joint_1 = require("uq-joint");
const webApiBaseUrl = config_1.default.get("busOutUrl");
class WebApiClient extends uq_joint_1.Fetch {
    constructor() {
        super(webApiBaseUrl);
    }
    async newOrder(order) {
        try {
            // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
            await this.post("SaleOrder/CreateNewSaleOrder", order);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async test(data) {
        let ret = await this.get("Customer/Get/0023A8557A");
        return ret;
    }
}
exports.WebApiClient = WebApiClient;
exports.httpClient = new WebApiClient();
//# sourceMappingURL=webApiClient.js.map