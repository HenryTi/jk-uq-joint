"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.faceUser = {
    face: '百灵威系统工程部/WebUser/User',
    from: 'center',
    mapper: {
        id: true,
        name: true,
        nice: false,
        icon: false,
        country: false,
        mobile: true,
        email: true,
        pwd: true,
    }
};
exports.faceWebUser = {
    face: '百灵威系统工程部/WebUser/WebUser',
    from: 'local',
    mapper: {
        id: false,
        no: true,
        name: true,
        firstName: true,
        lastName: true,
        gender: true,
        salutation: true,
        orgnizationName: true,
        departmentName: true,
    },
    // push: faceOrderPush,
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
//# sourceMappingURL=webUserBus.js.map