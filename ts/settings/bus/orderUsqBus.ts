import { UqBus, DataPush, Joint } from "../../uq-joint";
import { WebApiClient } from "../../tools/webApiClient";
import { uqs } from "../uqs";
import _ from 'lodash';

const faceOrderPush: DataPush<UqBus> = async (joint: Joint, uqBus: UqBus, queue: number, orderIn: any): Promise<boolean> => {
    console.log(orderIn);

    let orderOut: any = _.pick(orderIn, ['id', 'Id', 'SaleOrderItems']);
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
    let httpClient = new WebApiClient();
    try {
        let ret = await httpClient.newOrder(orderOut);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getConsignee(shippingContact: any): any {
    let Consignee: any = {
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
        }
    }
    return Consignee;
}

function getInvoiceReceiver(invoiceContact: any): any {
    if (invoiceContact !== undefined) {
        let InvoiceReceiver: any = {
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

export const faceOrder: UqBus = {
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
        invoiceContact: {
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
        }
    }
};
