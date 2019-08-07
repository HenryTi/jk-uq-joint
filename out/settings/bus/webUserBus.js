"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uqs_1 = require("../uqs");
exports.faceWebUser = {
    face: '百灵威系统工程部/WebUser/WebUser',
    mapper: {
        id: false,
        Id: "no",
        UserName: "",
        Password: "",
        Name: "name",
        Sex: "gender",
        UnitName: "orgnizationName",
        DepartmentName: "departmentName",
        Mobile: "mobile",
        Tel: "telephone",
        Fax: "fax",
        PostCode: "zipCode",
        Email: "email",
        EmailTF: false,
        ProvinceName: "",
        CityName: "",
        Address: "",
        InvoiceType: "",
        InvoiceHeader: "",
        Tax: "",
        Account: "",
        Distributor: false
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