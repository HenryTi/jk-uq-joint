"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webApiClient_1 = require("../../tools/webApiClient");
const uqs_1 = require("../uqs");
const lodash_1 = __importDefault(require("lodash"));
const faceOrderPush = async (joint, uqBus, queue, orderIn) => {
    console.log(orderIn);
    let orderOut = lodash_1.default.pick(orderIn, ['id', 'Id', 'SaleOrderItems']);
    orderOut.Customer = { Id: orderIn.Customer };
    if (orderIn.shippingContact !== undefined) {
        orderOut.Consignee = getConsignee(orderIn.shippingContact);
    }
    if (orderIn.invoiceContact !== undefined) {
        orderOut.InvoiceReceiver = getInvoiceReceiver(orderIn.invoiceContact);
    }
    orderOut.PaymentRule = { Id: '1' };
    orderOut.InvoiceService = { id: '正常开票' };
    orderOut.TransportMethodId = 'Y';
    orderOut.SaleOrderItems.forEach((element, index) => {
        element.Id = orderOut.Id + (index + 1).toString().padStart(5, '0');
        element.TransportMethod = { Id: 'Y' };
        element.SalePrice = { Value: element.Price, Currency: element.Currency };
    });
    console.log(orderOut);
    // 调用7.253的web api
    let httpClient = new webApiClient_1.WebApiClient();
    try {
        let ret = await httpClient.newOrder(orderOut);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
function getConsignee(shippingContact) {
    let Consignee = {
        ConsigneeName: shippingContact.name,
        ConsigneeUnitName: shippingContact.organizationName,
        ConsigneeTelephone: shippingContact.telephone,
        ConsigneeMobile: shippingContact.mobile,
        ConsigneeFax: "",
        ConsigneeEmal: shippingContact.email,
        ConsigneeAddress: {
            ConsigneeAddressDetail: shippingContact.addressString,
        }
    };
    if (shippingContact.address !== undefined) {
        let { country, province, city, county, description, zipcode } = shippingContact.address;
        Consignee.ConsigneeAddress = {
            // Country: country && country.chineseName,
            // Province: province && province.chineseName,
            City: city && city.chineseName,
            // County: county && county.chineseName,
            ConsigneeAddressDetail: description,
            zipcode: zipcode,
        };
    }
    return Consignee;
}
function getInvoiceReceiver(invoiceContact) {
    if (invoiceContact !== undefined) {
        let InvoiceReceiver = {
            InvoiceReceiverUserName: invoiceContact.name,
            InvoiceReceiverUnitName: invoiceContact.organizationName,
            InvoiceReceiverTelephone: invoiceContact.telephone,
            InvoiceReceiverUserMobile: invoiceContact.mobile,
            InvoiceReceiverEmal: invoiceContact.email,
        };
        if (invoiceContact.address !== undefined) {
            let { country, province, city, county, description, zipcode } = invoiceContact.address;
            InvoiceReceiver.InvoiceReceiverProvince = province && province.chineseName;
            // InvoiceReceiver.InvoiceReceiverCity = city && city.chineseName;
            InvoiceReceiver.InvoiceReceiverZipCode = zipcode;
            InvoiceReceiver.InvoiceAddrssDetail = description;
        }
        return InvoiceReceiver;
    }
}
exports.faceOrder = {
    face: '百灵威系统工程部/point/order',
    mapper: {
        id: true,
        Id: "no",
        Customer: "customer@Customer",
        shippingContact: true,
        invoiceContact: true,
        /*
        TransportMethodId: "Y",
        PaymentRule: 1,
        invoiceService: 1,
        */
        freightFee: true,
        freeghtFeeRemitted: true,
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