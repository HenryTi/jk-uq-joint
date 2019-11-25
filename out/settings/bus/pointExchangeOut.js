"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const uqs_1 = require("../uqs");
const orderUsqBus_1 = require("./orderUsqBus");
const webApiClient_1 = require("../../tools/webApiClient");
const facePointExchangePush = async (joint, uqBus, queue, orderIn) => {
    let orderOut = lodash_1.default.pick(orderIn, ['id', 'Id']);
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
        await webApiClient_1.httpClient.ExchangePoint(saleOrder.Id);
        return true;
    }
    catch (error) {
        console.error(error);
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
//# sourceMappingURL=pointExchangeOut.js.map