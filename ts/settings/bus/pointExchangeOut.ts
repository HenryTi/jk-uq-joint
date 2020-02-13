import _ from 'lodash';
import { UqBus, DataPush, Joint } from "uq-joint";
import { uqs } from "../uqs";
import { getConsignee, getInvoiceReceiver } from "./orderUsqBus";
import { httpClient } from "../../tools/webApiClient";
import { execSql } from '../../mssql/tools';


const facePointExchangePush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, orderIn: any): Promise<boolean> => {

    let orderOut: any = _.pick(orderIn, ['id']);
    orderOut.Id = 'POINTX' + orderIn.Id;
    orderOut.Customer = { Id: orderIn.Customer };
    if (orderIn.shippingContact !== undefined) {
        orderOut.Consignee = getConsignee(orderIn.shippingContact);
        orderOut.InvoiceReceiver = getInvoiceReceiver(orderIn.shippingContact);
    }

    orderOut.PaymentRule = { Id: '1' };
    orderOut.InvoiceService = { id: '正常开票' };
    orderOut.TransportMethodId = 'Y';

    orderOut.SaleOrderItems = orderIn.exchangeItems.map((element, index) => {
        element.Id = orderOut.Id + (index + 1).toString().padStart(5, '0');
        element.TransportMethod = { Id: 'Y' };
        element.SalePrice = { Value: 0, Currency: "RMB" };
        return element;
    });
    // console.log(orderOut);
    // 调用7.253的web api
    try {
        let saleOrder = await httpClient.newOrder(orderOut);
        await httpClient.ExchangePoint(orderOut.Id);
        return true;
    } catch (error) {
        console.error(orderOut.Id + ":" + error);
        return false;
    }

    return true;
}

export const facePointExchange: UqBus = {
    face: '百灵威系统工程部/pointShop/pointExchangeSheet',
    from: 'local',
    mapper: {
        id: true,
        Id: "no",
        Customer: "customer@Customer",
        shippingContact: true,
        freightFee: true,
        freeghtFeeRemitted: true,
        CreateDate: 'createDate',
        exchangeItems: {
            $name: "exchangeItems",
            Row: "$Row",
            PackageId: "pack@ProductX_PackX",
            Qty: "quantity",
            // Price: "price",
            // Currency: "^currency@Currency"
        }
    },
    push: facePointExchangePush,
    uqIdProps: {
        shippingContact: {
            uq: uqs.jkCustomer,
            tuid: 'Contact',
            props: {
                name: true,
                address: {
                    props: {
                        province: true,
                        country: true,
                        city: true,
                        county: true,
                    }
                }
            }
        },
    }
};

export const facePointOut: UqBus = {
    face: '百灵威系统工程部/pointShop/couponUsed',
    from: 'local',
    mapper: {
        orderId: true,
        Customer: "customer@Customer",
        amount: true,
        currency: "currency@Currency",
        point: true,
        coupon: true
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { orderId, Customer, point, coupon } = data;
        let title = 'tonva积分';
        let remark = orderId + ', coupon:' + coupon;
        let now = new Date();
        // 从tonva导来的积分，全部是未生效的积分
        await execSql(
            `insert into dbs.dbo.MScoreAlter(CID, MScore, MSYear, title, Note, EPID, IsEffective)
            values(@customer, @point, @year, @title, @note, @employee, 0)`, [
            { 'name': 'customer', 'value': Customer },
            { 'name': 'point', 'value': point },
            { 'name': 'year', 'value': now.getFullYear() },
            { 'name': 'title', 'value': title },
            { 'name': 'note', 'value': remark },
            { 'name': 'employee', 'value': 'LCT' },
        ]);
        return true;
    }
}