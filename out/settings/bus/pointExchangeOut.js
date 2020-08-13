"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceCreditsUsedByCustomer = exports.faceCreditsDrawedByCustomer = exports.facePointOut = exports.facePointExchange = void 0;
const lodash_1 = __importDefault(require("lodash"));
const uqs_1 = require("../uqs");
const orderUsqBus_1 = require("./orderUsqBus");
const webApiClient_1 = require("../../tools/webApiClient");
const tools_1 = require("../../mssql/tools");
const facePointExchangePush = async (joint, uqBus, queue, orderIn) => {
    let orderOut = lodash_1.default.pick(orderIn, ['id']);
    orderOut.Id = 'POINTX' + orderIn.Id;
    orderOut.Customer = { Id: orderIn.Customer };
    if (orderIn.shippingContact !== undefined) {
        orderOut.Consignee = orderUsqBus_1.getConsignee(orderIn.shippingContact);
        orderOut.InvoiceReceiver = orderUsqBus_1.getInvoiceReceiver(orderIn.shippingContact);
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
        let saleOrder = await webApiClient_1.httpClient.newOrder(orderOut);
        await webApiClient_1.httpClient.ExchangePoint(orderOut.Id);
        return true;
    }
    catch (error) {
        console.error(orderOut.Id + ":" + error);
        return false;
    }
    return true;
};
exports.facePointExchange = {
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
        }
    },
    push: facePointExchangePush,
    uqIdProps: {
        shippingContact: {
            uq: uqs_1.uqs.jkCustomer,
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
/**
 * 用于将tonva订单积分导入到内部系统
 */
exports.facePointOut = {
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
    push: async (joint, uqBus, queue, data) => {
        let { orderId, Customer, point, coupon } = data;
        let title = 'tonva积分';
        let remark = orderId + ', coupon:' + coupon;
        let now = new Date();
        // 从tonva导来的积分，全部是未生效的积分
        await tools_1.execSql(`insert into dbs.dbo.MScoreAlter(CID, MScore, MSYear, title, Note, EPID, IsEffective)
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
};
/**
 * 用于将客户领用的积分码导入内部系统（后续会据此匹配内部订单给双倍积分）
 */
exports.faceCreditsDrawedByCustomer = {
    face: '百灵威系统工程部/coupon/creditsDrawedByCustomer',
    from: 'local',
    mapper: {
        Customer: "customer@Customer",
        coupon: true
    },
    push: async (joint, uqBus, queue, data) => {
        let { Customer, coupon } = data;
        await tools_1.execSql(`insert into dbs.dbo.tonvaCreditsDrawed (CustomerID, CreditsID, CreateDate, IsUsed)
            values(@Customer, @CreditsId, getdate(), 0)`, [
            { 'name': 'Customer', 'value': Customer },
            { 'name': 'CreditsID', 'value': coupon },
        ]);
        return true;
    }
};
/**
 * 用于将tonva订单使用的coupon导入到内部系统(后续据此计算内部系统的积分)
 */
exports.faceCreditsUsedByCustomer = {
    face: '百灵威系统工程部/coupon/creditsUsedByCustomer',
    from: 'local',
    mapper: {
        orderId: true,
        Customer: "customer@Customer",
        amount: true,
        currency: "currency@Currency",
        point: true,
        coupon: true
    },
    push: async (joint, uqBus, queue, data) => {
        let { orderId, Customer, point, coupon } = data;
        await tools_1.execSql(`exec dbs.dbo.tv_SalesOrderCredits @SOrderID, @CustomerID, @CreditsID, @Point, @Rate;
            delete from dbs.dbo.tonvaCreditsDrawed where CustomerID = @CustomerID and CreditsID = @CreditsID `, [
            { 'name': 'SOrderID', 'value': orderId },
            { 'name': 'CustomerID', 'value': Customer },
            { 'name': 'CreditsID', 'value': coupon },
            { 'name': 'Point', 'value': point },
            { 'name': 'Rate', 'value': 2 },
        ]);
        return true;
    }
};
/*
export const faceSignInPointOut: UqBus = {
    face: '百灵威系统工程部/pointShop/signIn',
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
        let { Customer, point } = data;
        let title = 'tonva积分';
        let remark = '签到等立即生效的积分';
        let now = new Date();
        // 从tonva导来的积分，全部是未生效的积分
        await execSql(
            `insert into dbs.dbo.MScoreAlter(CID, MScore, MSYear, title, Note, EPID, IsEffective)
            values(@customer, @point, @year, @title, @note, @employee, 1)`, [
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
*/ 
//# sourceMappingURL=pointExchangeOut.js.map