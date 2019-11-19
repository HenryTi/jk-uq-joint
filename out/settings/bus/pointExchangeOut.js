"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("settings/uqs");
const facePointExchangePush = async (joint, uqBus, queue, orderIn) => {
    return true;
};
exports.faceOrder = {
    face: '百灵威系统工程部/point/order',
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
            Price: "price",
            Currency: "^currency@Currency"
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