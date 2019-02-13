import { UqBus, DataPush, Joint } from "../../uq-joint";
import { WebApiClient } from "../../tools/webApiClient";
import { uqs } from "../uqs";
import { databaseName } from "../../uq-joint/db/mysql/database";
import { MapFromUq } from "../../uq-joint/tool/mapData";

const faceOrderPush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, order: any): Promise<boolean> => {
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

    /*
    let shippingContact = undefined;
    if (order.shippingContact > 0) {
        shippingContact = await joint.loadTuid(us.jkCustomer, 'contact', order.shippingContact);
        if (shippingContact !== undefined) {
            let shippingContactAddress;
            if (shippingContact.address > 0)
                shippingContactAddress = await joint.loadTuid(us.jkCommon, 'address', shippingContact.address);
            await setConsignee(joint, order, shippingContact, shippingContactAddress);
        }
    }

    let invoiceContact;
    if (order.invoiceContact > 0) {
        if (order.invoiceContact == order.shippingContact)
            invoiceContact = shippingContact;
        else {
            invoiceContact = await joint.loadTuid(us.jkCustomer, 'contact', order.invoiceContact);
            if (invoiceContact !== undefined) {
                let invoiceContactAddress;
                if (invoiceContact.address > 0) {
                    invoiceContactAddress = await joint.loadTuid(us.jkCommon, 'address', invoiceContact.address);
                }
                setInvoiceReceiver(order, invoiceContact, invoiceContactAddress);
            }
        }
    }
    */
    // 调用7.253的web api
    let httpClient = new WebApiClient();
    let ret = await httpClient.newOrder(order);
    return true;
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
                //order.Consignee.ConsigneeAddress.city = joint.tuidMapFromUsq("city", city);
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

export const faceOrder: UqBus = {
    face: '百灵威系统工程部/point/order',
    mapper: {
        id: true,
        Id: "no",
        Customer: "customer@Customer",
        Organization: true,
        shippingContact: true,
        invoiceContact: true,
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
                    }
                }
            }
        }
    }
};
