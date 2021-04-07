"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOrder = exports.getInvoiceReceiver = exports.getConsignee = exports.newTonvaSorderCustomer = exports.newSorder = void 0;
const webApiClient_1 = require("../../tools/webApiClient");
const uqs_1 = require("../uqs");
const lodash_1 = __importDefault(require("lodash"));
const tools_1 = require("../../mssql/tools");
const faceOrderPush = async (joint, uqBus, queue, orderIn) => {
    // console.log(orderIn);
    let { type: busType } = orderIn;
    if (busType && busType !== 1 && busType !== 3) {
        // 非目标bus数据，放弃不处理
        return true;
    }
    // console.log(orderOut);
    // 调用7.253的web api
    try {
        let success = await newSorder(orderIn);
        success = success && await newTonvaSorderCustomer(orderIn);
        return success;
    }
    catch (error) {
        console.error(error);
    }
};
async function newSorder(orderIn) {
    let { Customer: CustomerID, shippingContact, invoiceContact, freightFee, freightFeeRemitted, endUserId } = orderIn;
    let orderOut = lodash_1.default.pick(orderIn, ['id', 'Id', 'SaleOrderItems']);
    orderOut.Customer = { Id: CustomerID };
    if (shippingContact !== undefined) {
        orderOut.Consignee = getConsignee(shippingContact);
    }
    if (invoiceContact !== undefined) {
        orderOut.InvoiceReceiver = getInvoiceReceiver(invoiceContact);
    }
    orderOut.PaymentRule = { Id: '1' };
    orderOut.InvoiceService = { id: '正常开票' };
    orderOut.TransportMethodId = 'Y';
    orderOut.SaleOrderItems.forEach((element, index) => {
        element.Id = orderOut.Id + (index + 1).toString().padStart(5, '0');
        element.TransportMethod = { Id: 'Y' };
        element.SalePrice = { Value: element.Price, Currency: element.Currency };
        element.EndUserId = endUserId;
    });
    let realFreightFee = freightFee + (freightFeeRemitted || 0);
    if (realFreightFee > 0) {
        orderOut.SaleOrderItems.push({
            Id: orderOut.Id + (orderOut.SaleOrderItems.length + 1).toString().padStart(5, '0'),
            PackageId: "J00Z-EXPRESS",
            Qty: 1,
            TransportMethod: { Id: 'Y' },
            SalePrice: { Value: realFreightFee, Currency: "RMB" },
            EndUserId: endUserId,
            Mark: "PR",
            PurchaseOrderId: "ready",
        });
    }
    // console.log(orderOut);
    // 调用7.253的web api
    try {
        await webApiClient_1.httpClient.newOrder(orderOut);
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.newSorder = newSorder;
async function newTonvaSorderCustomer(orderIn) {
    try {
        await tools_1.execSql(`insert into dbs.dbo.tonvaSorderCustomer( SorderId, Customer ) values( @SorderId, @Customer );`, [
            { 'name': 'SorderId', 'value': orderIn.Id },
            { 'name': 'Customer', 'value': orderIn.endUserId },
        ]);
        return true;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
exports.newTonvaSorderCustomer = newTonvaSorderCustomer;
function getConsignee(shippingContact) {
    let { name, organizationName, telephone, mobile, email, address, addressString } = shippingContact;
    let Consignee = {
        ConsigneeName: name,
        ConsigneeUnitName: organizationName,
        ConsigneeTelephone: telephone,
        ConsigneeMobile: mobile,
        ConsigneeFax: "",
        ConsigneeEmail: email,
    };
    if (address !== undefined) {
        let { country, province, city, county, zipcode } = address;
        Consignee.ConsigneeAddress = {
            // Country: country && country.chineseName,
            // Province: province && province.chineseName,
            City: city && city.chineseName,
            County: county && county.chineseName,
            zipcode: zipcode,
        };
        Consignee.ConsigneeAddress.ConsigneeAddressDetail = (province && province.chineseName != undefined ? province.chineseName : '') + (city && city.chineseName != undefined ? city.chineseName : '') + (county && county.chineseName != undefined ? county.chineseName : '') + addressString;
    }
    else {
        throw new Error(JSON.stringify(shippingContact) + " has no valid address.");
    }
    return Consignee;
}
exports.getConsignee = getConsignee;
function getInvoiceReceiver(invoiceContact) {
    if (invoiceContact !== undefined) {
        let InvoiceReceiver = {
            InvoiceReceiverUserName: invoiceContact.name,
            InvoiceReceiverUnitName: invoiceContact.organizationName,
            InvoiceReceiverTelephone: invoiceContact.telephone,
            InvoiceReceiverUserMobile: invoiceContact.mobile,
            InvoiceReceiverEmail: invoiceContact.email,
        };
        if (invoiceContact.address !== undefined) {
            let { country, province, city, county, zipcode } = invoiceContact.address;
            InvoiceReceiver.InvoiceReceiverProvince = province && province.chineseName;
            InvoiceReceiver.InvoiceReceiverCity = city && city.chineseName;
            InvoiceReceiver.InvoiceReceiverZipCode = zipcode;
            InvoiceReceiver.InvoiceAddressDetail = (province && province.chineseName != undefined ? province.chineseName : '') + (city && city.chineseName != undefined ? city.chineseName : '') + (county && county.chineseName != undefined ? county.chineseName : '') + invoiceContact.addressString;
        }
        else {
            throw new Error(JSON.stringify(invoiceContact) + " has no valid address.");
        }
        return InvoiceReceiver;
    }
}
exports.getInvoiceReceiver = getInvoiceReceiver;
exports.faceOrder = {
    // face: '百灵威系统工程部/point/order',
    face: '百灵威系统工程部/order/order',
    from: 'local',
    mapper: {
        id: true,
        type: true,
        Id: "no",
        Customer: "buyerAccount@BuyerAccount",
        endUserId: "customer@Customer",
        shippingContact: true,
        invoiceContact: true,
        /*
        TransportMethodId: "Y",
        PaymentRule: 1,
        invoiceService: 1,
        */
        freightFee: true,
        freightFeeRemitted: true,
        Comments: 'comments',
        CreateDate: 'createDate',
        SaleOrderItems: {
            $name: "orderItems",
            Row: "$Row",
            PackageId: "pack@ProductX_PackX",
            Qty: "quantity",
            Price: "price",
            Currency: "^currency@Currency"
            /*
            DeliveryTimeMin: true,
            DeliveryTimeMax:
            DeliveryTimeUnit:
            DeliveryTime:
            PrepackBulkMedical: "P",
            TransportMethod: {Id: "P"}
            Mark: "Y",
            EndUserName: 123,
            */
        }
    },
    push: faceOrderPush,
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
        invoiceContact: {
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
        }
    }
};
//# sourceMappingURL=orderUsqBus.js.map