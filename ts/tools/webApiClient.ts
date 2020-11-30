import config from 'config';
import fetch from 'node-fetch';
import { Fetch } from "uq-joint";

const webApiBaseUrl = config.get<string>("busOutUrl");

export class WebApiClient extends Fetch {

    constructor() {
        super(webApiBaseUrl);
    }

    async addSaleOrderCoupon(order: any): Promise<any> {
        try {

            let result = await this.get("SaleOrder/AddSaleOrderCoupon", order);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
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

    async addUseCouponOrder(order: any): Promise<any> {
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

    async getPrice(packageId: string, salesRegionId: string): Promise<any> {
        try {
            /*
            不能使用uq-joint中提供的Fetch，该Fetch要求返回结果的格式是{ok: true|false, res: data}，下面的方法不提供该格式
            return await this.get("ProductCatalog/GetPrice", { packageId: packageId, salesRegionId: salesRegionId });
            */
            let res = await fetch(webApiBaseUrl + "ProductCatalog/GetPrice?packageId=" + encodeURI(packageId) + "&salesRegionId=" + salesRegionId);
            if (res.status === 200) {
                return res.json();
            }
            return undefined;
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