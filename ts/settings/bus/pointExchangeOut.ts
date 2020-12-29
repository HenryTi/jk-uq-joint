import _ from 'lodash';
import { UqBus, DataPush, Joint } from "uq-joint";
import { uqs } from "../uqs";
import { getConsignee, getInvoiceReceiver } from "./orderUsqBus";
import { httpClient } from "../../tools/webApiClient";
import { execSql } from '../../mssql/tools';
import fetch from 'node-fetch';
import config from 'config';

const JD: string = 'jd.com'
const SELF: string = 'self'

const facePointExchangePush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, orderIn: any): Promise<boolean> => {

    let result: boolean = true;
    let selfItems = orderIn.exchangeItems.filter(e => e.source === SELF);
    if (selfItems.length > 0) {
        result = await createSelfOrder(orderIn);
    }

    if (result) {
        let jdItems = orderIn.exchangeItems.filter(e => e.source === JD);
        if (jdItems.length > 0) {
            result = await createJDOrder(orderIn);
        }
    }
    return result;
}

/**
 * 
 * @param orderIn 
 */
async function createSelfOrder(orderIn: any) {

    let orderOut: any = _.pick(orderIn, ['id']);
    orderOut.Id = 'POINTX' + orderIn.Id;
    orderOut.Customer = { Id: orderIn.Customer };
    if (orderIn.shippingContact === undefined && orderIn.shippingContact.address === undefined) {
        throw new Error(JSON.stringify(orderIn) + ' not have valid address');
    }
    orderOut.Consignee = getConsignee(orderIn.shippingContact);
    orderOut.InvoiceReceiver = getInvoiceReceiver(orderIn.shippingContact);

    orderOut.PaymentRule = { Id: '1' };
    orderOut.InvoiceService = { id: '正常开票' };
    orderOut.TransportMethodId = 'Y';

    orderOut.SaleOrderItems = orderIn.exchangeItems.filter(e => e.source === SELF).map((element, index) => {
        element.Id = orderOut.Id + (index + 1).toString().padStart(5, '0');
        element.TransportMethod = { Id: 'Y' };
        element.SalePrice = { Value: 0, Currency: "RMB" };
        return element;
    });

    if (orderIn.Customer && orderOut.SaleOrderItems.length > 0) {
        // 调用7.253的web api
        let promises: PromiseLike<any>[] = [];
        orderOut.SaleOrderItems.forEach(element => {
            promises.push(httpClient.getPrice(element.PackageId, 'CN'));
        });
        try {
            let prices = await Promise.all(promises);
            orderOut.SaleOrderItems.forEach(element => {
                let packageWithPrice = prices.find(e => e.Id === element.PackageId);
                if (packageWithPrice && packageWithPrice.Price) {
                    element.SalePrice = packageWithPrice.Price;
                }
            });
            await httpClient.newOrder(orderOut);
            await httpClient.ExchangePoint(orderOut.Id);
            return true;
        } catch (error) {
            console.error(orderOut.Id + ":" + error);
            throw error;
        }
    }
}

/**
 * 
 * @param orderIn 
 */
async function createJDOrder(orderIn: any) {

    orderIn.exchangeItems = orderIn.exchangeItems.filter(e => e.source === JD).map((element, index) => {
        element.Id = orderIn.Id + (index + 1).toString().padStart(5, '0');
        return element;
    });

    try {
        let res = await fetch(config.get<string>('jdInnerBaseUrl') + "/submitOrder", {
            method: 'post',
            body: JSON.stringify(orderIn),
            headers: { 'content-type': 'application/json' }
        });
        if (res.ok) {
            let result = await res.json();
            let { success } = result;
            if (success) {
                return true;
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


/**
 * 积分兑换单导入到内部系统
 */
export const facePointExchange: UqBus = {
    face: '百灵威系统工程部/pointShop/pointExchangeSheet',
    from: 'local',
    mapper: {
        id: true,
        Id: "no",
        Customer: "customer@Customer",
        shippingContact: true,
        amount: true,
        freightFee: true,
        freeghtFeeRemitted: true,
        CreateDate: 'createDate',
        exchangeItems: {
            $name: "exchangeItems",
            Row: "$Row",
            PackageId: "sourceId@ProductX_PackX",
            JDSkuId: "sourceId",
            source: true,
            Qty: "quantity",
            point: true,
            subAmount: true,
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

/**
 * 用于将客户领用的积分码导入内部系统（后续会据此匹配内部订单给双倍积分） 
 */
export const faceCreditsDrawedByCustomer: UqBus = {
    face: '百灵威系统工程部/coupon/creditsDrawedByCustomer',
    from: 'local',
    mapper: {
        Customer: "customer@Customer",
        WebUser: "webUser",
        coupons: {
            coupon: true,
            createDate: true,
            expiredDate: true,
        },
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { Customer, WebUser, coupons } = data;
        for (let i = 0; i < coupons.length; i++) {
            let { coupon, createDate, expiredDate } = coupons[i];
            await execSql(
                `insert into dbs.dbo.tonvaCreditsDrawed (CustomerID, WebUserID, CreditsID, CreateDate, ExpiredDate, IsUsed)
                values(@Customer, @WebUser, @CreditsId, @CreateDate, @ExpiredDate, 0)`, [
                { 'name': 'Customer', 'value': Customer },
                { 'name': 'WebUser', 'value': WebUser },
                { 'name': 'CreditsID', 'value': coupon },
                { 'name': 'CreateDate', 'value': createDate },
                { 'name': 'ExpiredDate', 'value': expiredDate },
            ]);
        }
        return true;
    }
}

/**
 * 用于将tonva订单使用的coupon导入到内部系统(后续据此计算内部系统的积分)
 */
export const faceCreditsUsedByCustomer: UqBus = {
    face: '百灵威系统工程部/coupon/creditsUsedByCustomer',
    from: 'local',
    mapper: {
        orderId: true,
        Customer: "customer@Customer",
        amount: true,
        currency: "currency@Currency",
        point: true,
        coupon: true,
        orderItems: {
            row: "row",
            orderItemId: true,
            point: true,
        }
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { orderId, Customer, coupon, orderItems } = data;
        if (orderItems && orderItems.length > 0) {
            for (let i = 0; i < orderItems.length; i++) {
                let { row, orderItemId, point } = orderItems[i];
                if (!orderItemId)
                    orderItemId = orderId + (i + 1).toString().padStart(5, '0');
                await execSql(`exec dbs.dbo.lp_tonvaCreditsUsed @OrderID, @SOrderID, @CustomerID, @CreditsID, @Point;`,
                    [
                        { 'name': 'OrderID', 'value': orderItemId },
                        { 'name': 'SOrderID', 'value': orderId },
                        { 'name': 'CustomerID', 'value': Customer },
                        { 'name': 'CreditsID', 'value': coupon },
                        { 'name': 'Point', 'value': point }
                    ])
            }
        } else {

        }
        await execSql(`delete from dbs.dbo.tonvaCreditsDrawed where CustomerID = @CustomerID and CreditsID = @CreditsID`, [
            { 'name': 'CustomerID', 'value': Customer },
            { 'name': 'CreditsID', 'value': coupon },
        ])
        return true;
    }
}

/**
 * 用于将签到积分导入到内部系统
 */
export const faceSignInPointOut: UqBus = {
    face: '百灵威系统工程部/pointShop2/customerSignIn',
    from: 'local',
    mapper: {
        customer: "customer@Customer",
        webUser: true,
        pointYear: true,
        point: true,
        comments: true
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { customer, pointYear, point, comments } = data;
        let title = '签到积分';
        await adjustInnerPoints(customer, point, pointYear, title, comments);
        return true;
    }
}

async function adjustInnerPoints(customer: string, point: number, pointYear: number, title: string, comments: string) {
    await execSql(
        `if exists( select 1 from dbs.dbo.MScoreAlter where CID = @customer and MSYear = @year and title = @title)
                update dbs.dbo.MScoreAlter set MScore += @point where CID = @customer and MSYear = @year and title = @title
            else 
                insert into dbs.dbo.MScoreAlter(CID, MScore, MSYear, title, Note, EPID, IsEffective)
                values(@customer, @point, @year, @title, @note, 'LCT', 1)`, [
        { 'name': 'customer', 'value': customer },
        { 'name': 'point', 'value': point },
        { 'name': 'year', 'value': pointYear },
        { 'name': 'title', 'value': title },
        { 'name': 'note', 'value': comments },
    ]);
}

/*
// 删除——由CreditsUsedByCustomer替换——用于将tonva订单积分导入到内部系统
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
*/