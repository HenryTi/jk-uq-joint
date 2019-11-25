import config from 'config';
import { Fetch } from "uq-joint";

const webApiBaseUrl = config.get<string>("busOutUrl");

export class WebApiClient extends Fetch {

    constructor() {
        super(webApiBaseUrl);
    }

    async newOrder(order: any): Promise<any> {
        try {
            // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
            let result = await this.post("SaleOrder/CreateNewSaleOrder", order);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async ExchangePoint(orderId: string): Promise<boolean> {
        try {
            await this.post(`PointShop/Exchange?saleOrderId=${orderId}`, undefined);
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async test(data: any): Promise<any> {
        let ret = await this.get("Customer/Get/0023A8557A");
        return ret;
    }
}

export const httpClient = new WebApiClient();