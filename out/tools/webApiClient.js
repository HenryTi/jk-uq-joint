"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("../uq-joint/tool/fetch");
// const webApiBaseUrl = "http://211.5.7.253/mvc/api/";
const webApiBaseUrl = "http://localhost:38311/api/";
class WebApiClient extends fetch_1.Fetch {
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
            return false;
        }
    }
    async test(data) {
        let ret = await this.get("Customer/Get/0023A8557A");
        return ret;
    }
}
exports.WebApiClient = WebApiClient;
//# sourceMappingURL=webApiClient.js.map