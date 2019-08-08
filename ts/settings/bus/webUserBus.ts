import { UqBus } from "../../uq-joint";
import { uqs } from "../uqs";

export const faceWebUser: UqBus = {
    face: '百灵威系统工程部/WebUser/WebUser',
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
        /*
        Id: "no",
        UserName: "",
        Password: "",
        Name: "name",
        Sex: "gender",
        UnitName: "orgnizationName",   // Compay?
        DepartmentName: "departmentName",
        Mobile: "mobile",
        Tel: "telephone",
        Fax: "fax",
        PostCode: "zipCode",
        Email: "email",
        EmailTF: false,   //EmailPermit?
        ProvinceName: "",
        CityName: "",
        Address: "",
        InvoiceType: "",
        InvoiceHeader: "",
        Tax: "",
        Account: "",
        Distributor: false
        */
    },
    // push: faceOrderPush,
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
