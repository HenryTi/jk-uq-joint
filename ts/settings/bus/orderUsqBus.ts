import { UsqBus, DataPush, Joint } from "../../usq-joint";
import { WebApiClient } from "../../tools/webApiClient";
import { usqs } from "../usqs";
import { databaseName } from "../../usq-joint/db/mysql/database";
import { MapFromUsq } from "../../usq-joint/tool/mapData";

const faceOrderPush: DataPush = async (joint: Joint, face: string, queue: number, order: any): Promise<boolean> => {
    console.log(order);

    /*
    let promises: PromiseLike<any>[] = [];
    if (order.shippingContact) {
        promises.push(joint.loadTuid(usqs.jkCustomer, 'contact', order.shippingContact));
    }
    if (order.invoiceContact > 0) {
        promises.push(joint.loadTuid(usqs.jkCustomer, 'contact', order.invoiceContact));
    }
    let result1 = await Promise.all(promises);

    let p1 = 0;
    if (order.shippingContact) {
        let shippingContact = result1[p1++];
        if (shippingContact && shippingContact.address > 0){}
    }
    if (order.invoiceContact > 0) {
        promises.push(joint.loadTuid(usqs.jkCustomer, 'contact', order.invoiceContact));
    }
    */

    let shippingContact = undefined;
    if (order.shippingContact > 0) {
        shippingContact = await joint.loadTuid(usqs.jkCustomer, 'contact', order.shippingContact);
        if (shippingContact !== undefined) {
            let shippingContactAddress;
            if (shippingContact.address > 0)
                shippingContactAddress = await joint.loadTuid(usqs.jkCommon, 'address', shippingContact.address);
            await setConsignee(joint, order, shippingContact, shippingContactAddress);
        }
    }

    let invoiceContact;
    if (order.invoiceContact > 0) {
        if (order.invoiceContact == order.shippingContact)
            invoiceContact = shippingContact;
        else {
            invoiceContact = await joint.loadTuid(usqs.jkCustomer, 'contact', order.invoiceContact);
            if (invoiceContact !== undefined) {
                let invoiceContactAddress;
                if (invoiceContact.address > 0) {
                    invoiceContactAddress = await joint.loadTuid(usqs.jkCommon, 'address', invoiceContact.address);
                }
                setInvoiceReceiver(order, invoiceContact, invoiceContactAddress);
            }
        }
    }
    // 调用7.253的web api
    let httpClient = new WebApiClient();
    // let ret = await httpClient.test({});
    order.Id = "eiiigwooige";
    let ret = await httpClient.newOrder(order);
    return ret;
}

async function setConsignee(joint: Joint, order: any, shippingContact: any, shippingContactAddress: any): Promise<void> {
    if (shippingContact !== undefined) {
        order.Consignee = {
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
        if (shippingContactAddress !== undefined) {
            let { city, zipcode } = shippingContactAddress;
            if (city !== undefined) {
                order.Consignee.ConsigneeAddress.city = joint.tuidMapFromUsq("city", city);
            }
            order.Consignee.ConsigneeAddress.zipcode = zipcode;
        }
    }
}

async function setInvoiceReceiver(order: any, invoiceContact: any, invoiceContactAddress: any) {
    if (invoiceContact !== undefined) {
        order.InvoiceReceiver = {
            InvoiceReceiverUserName: invoiceContact.name,
            InvoiceReceiverUnitName: invoiceContact.organizationName,
            InvoiceReceiverTelephone: invoiceContact.telephone,
            InvoiceReceiverUserMobile: invoiceContact.mobile,
            InvoiceReceiverEmal: invoiceContact.email,
        };
        if (invoiceContactAddress !== undefined) {
            order.InvoiceReceiver.InvoiceReceiverProvince = invoiceContactAddress.province;
            order.InvoiceReceiver.InvoiceReceiverCity = invoiceContactAddress.city;
            order.InvoiceReceiver.InvoiceReceiverZipCode = invoiceContactAddress.zipcode;
            order.InvoiceReceiver.InvoiceAddrssDetail = invoiceContact.addressString;
        }
    }
}

export const faceOrder: UsqBus = {
    face: '百灵威系统工程部/point/order',
    mapper: {
        Id: "no",
        // Customer: "customer@Customer",
        Customer: 1,
        Organization: true,
        shippingContact: 1999,
        invoiceContact: 1999,
        /*saleEmployeeId: true,
        TransportMethodId: "Y",
        PaymentRule: 1,
        invoiceService: 1,
        */
        freightFee: true,
        freeghtFeeRemitted: true,
        CreateDate: 'createDate',
        SaleOrderItems: {
            $name: "orderItems",
            Id: 1,
            PackageId: "pack@ProductX.PackX",
            Qty: "quantity",
            SalePrice: "price",
            SalePriceCurrency: "^currency@Currency"
            /*
            DeliveryTime: true,
            PrepackBulkMedical: "P",
            TransportMethod: "P",
            Mark: "Y",
            EndUserName: 123,
            */
        }
    },
    push: faceOrderPush,
};
