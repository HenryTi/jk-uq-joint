import { Fetch } from "../usq-joint/tool/fetch";

// const webApiBaseUrl = "http://211.5.7.253/mvc/api/";
const webApiBaseUrl = "http://localhost:38311/api/";

export class WebApiClient extends Fetch {

    constructor() {
        super(webApiBaseUrl);
    }

    async newOrder(order: any): Promise<boolean> {
        try {
            // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
            await this.post("SaleOrder/CreateNewSaleOrder", order);
            return true;
        } catch (error) {
            return false;
        }
    }

    async test(data: any): Promise<any> {
        let ret = await this.get("Customer/Get/0023A8557A");
        return ret;
    }
}