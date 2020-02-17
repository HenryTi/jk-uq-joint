import * as _ from 'lodash';
import { UqInTuid, UqInMap, UqInTuidArr, Joint, UqIn, DataPullResult } from "uq-joint";
import { uqs } from "../uqs";
import { customerPullWrite, contactPullWrite } from '../../first/converter/customerPullWrite';
import config from 'config';
import { logger } from '../../tools/logger';
import { uqOutRead } from "../../first/converter/uqOutRead";

const promiseSize = config.get<number>("promiseSize");

export const Customer: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Customer',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@Customer',
        no: "CustomerID",
        name: 'Name',
        firstName: 'FirstName',
        lastName: 'LastName',
        gender: 'Gender',
        salutation: 'Salutation',
        birthDay: 'BirthDate',
        createTime: 'CreateTime',
        isValid: 'IsValid',
        XYZ: 'XYZ',
    },
    pull: `select top ${promiseSize} ID, CustomerID, OrganizationID, Name, FirstName, LastName, XYZ, Gender, BirthDate, Tel1, Tel2, Mobile, Email, Email2
           , Fax1, Fax2, Zip, InvoiceTitle, TaxNo, RegisteredAddress, RegisteredTelephone, BankName, BankAccountNumber
           , SalesmanID, CustomerServiceStuffID, IsValid, SalesComanyID as SalesCompanyID, SalesRegionBelongsTo, CreateTime
           from ProdData.dbo.Export_Customer where ID > @iMaxId order by ID`,
    pullWrite: customerPullWrite,
    firstPullWrite: customerPullWrite,
};

export const Organization: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'OrganizationID',
    mapper: {
        $id: 'OrganizationID@Organization',
        no: 'OrganizationID',
        name: 'Name',
        createTime: 'CreateTime',
    },
    pull: `select top ${promiseSize} ID, OrganizationID, UnitName as Name, CreateTime
           from ProdData.dbo.Export_Organization where ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime() / 1000; // dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(Organization, data);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

export const OrganizationCustomer: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};

export const CustomerContact: UqInTuidArr = {
    uq: uqs.jkCustomer,
    type: 'tuid-arr',
    entity: 'Customer_Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer_Contact',
        type: 'TypeID',
        content: 'Content',
    }
};

export const CustomerContacts: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
            isDefault: '^isDefault',
        }
    }
};

export const Contact: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'Contact',
    key: 'ContactID',
    mapper: {
        $id: 'ContactID@Contact',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
    },
    pullWrite: contactPullWrite,
};

export const InvoiceInfo: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'CustomerID',  // CustomerID作为InvoiceInfo的ID
    mapper: {
        $id: 'CustomerID@InvoiceInfo',
        title: 'InvoiceTitle',
        address: 'RegisteredAddress',
        telephone: 'RegisteredTelephone',
        bank: 'BankName',
        accountNo: 'BankAccountNumber',
        invoiceType: 'InvoiceType',
    },
};

export const CustomerSetting: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerSetting',
    mapper: {
        customer: 'CustomerID@Customer',
        shippingContact: 'ShippingContactID@Contact',
        invoiceContact: 'InvoiceContactID@Contact',
        invoiceType: 'InvoiceTypeID@InvoiceType',
        invoiceInfo: 'InvoiceInfoID@InvoiceInfo',
    }
};

export const CustomerHandler: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerHandler',
    mapper: {
        customer: 'CustomerID@Customer',
        salesman: 'SalesmanID@Employee',
        arr1: {
            customerServiceStuff: '^CustomerServiceStuffID@Employee',
        }
    }
};

/*
 * 这个比较特殊：该映射用于将内部的CID导入到Tonva系统
*/
export const CustomerContractor: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContractor',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contractor: '^ContractorID@Customer',
        }
    },
    pull: `select top ${promiseSize} ID, CustomerID, ContractorID, CreateTime
           from alidb.ProdData.dbo.Export_CustomerContractor where ID > @iMaxId order by ID`,
};

export const BuyerAccount: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'BuyerAccount',
    key: 'BuyerAccountID',
    mapper: {
        $id: 'BuyerAccountID@BuyerAccount',
        no: "BuyerAccountID",
        organization: "OrganizationID@Organization",
        description: 'Name',
        createTime: 'CreateTime',
        isValid: 'IsValid',
    },
    /*
    pull: `select top ${promiseSize} ID, CustomerID as BuyerAccountID, OrganizationID, Name, FirstName, LastName
           , IsValid, CreateTime
           from ProdData.dbo.Export_Customer
           where ID > @iMaxId and CustomerID in (select CID from dbs.dbo.vw_sordersBJSH)
           order by ID`,
    pull: async (joint: Joint, uqIn: UqInTuid, queue: number): Promise<DataPullResult> => {
        let step_seconds = 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', a.SODDateB) + 1 as ID, b.CID as BuyerAccountID, b.UnitID as OrganizationID
            , b.Name, b.FirstName, b.LastName
            , case b.C5 when 'xx' then 0 else 1 end as IsValid
            , b.creaDate as CreateTime
            from dbs.dbo.vw_TermsABJSH a inner join dbs.dbo.Customers b on a.CID_T = b.CID
            where a.SODDateB >= DATEADD(s, @iMaxId, '1970-01-01') and a.SODDateB <= DATEADD(s, ${nextQueue}, '1970-01-01')
            order by a.SODDateB`
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    },
    pullWrite: async (joint: Joint, data: any) => {
        data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000;
        await joint.uqIn(BuyerAccount, data);
        // 本人的BuyerAccount设置为本人
        let buyerAccountID = data['BuyerAccountID'];
        await joint.uqIn(CustomerBuyerAccount, { "CustomerID": buyerAccountID, 'BuyerAccountID': buyerAccountID });
        return true;
    }
    */
};

export const CustomerBuyerAccount: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerBuyerAccount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            buyerAccount: '^BuyerAccountID@BuyerAccount',
        }
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        // queue是当前时间举例1970-01-01的秒数
        let step_seconds = 10 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', a.Update__time) + 1 as ID, a.MakeOrderCID as CustomerID, a.Contractor as BuyerAccountID
            , case when a.Invalid = 0 then '-' else '' end as [$]
            , c.UnitID as Organization, c.Name, c.FirstName, c.LastName
            , case c.C5 when 'xx' then 0 else 1 end as IsValid
            , c.creaDate as CreateTime
            from dbs.dbo.MakeOrderPersonAndContractorRelationship a
                 inner join dbs.dbo.Customers c on a.Contractor = c.CID
            where a.Update__time >= DATEADD(s, @iMaxId, '1970-01-01') and a.Update__time <= DATEADD(s, ${nextQueue}, '1970-01-01')
            order by a.Update__time`
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined) {
                ret = { lastPointer: nextQueue, data: [] };
            }
            return ret;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    },
    pullWrite: async (joint: Joint, data: any) => {
        data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000;
        await joint.uqIn(BuyerAccount, data);
        await joint.uqIn(CustomerBuyerAccount, data);
        return true;
    }
};


export const Department: UqInTuid = {
    uq: uqs.jkCustomer,
    type: "tuid",
    entity: "Department",
    key: "deptid",
    mapper: {
        $id: "deptid@Department",
        no: "deptid",
        name: "deptname",
        organization: "unitid@Organization"
    },
    pull: ` select top ${promiseSize} unitid, deptid, deptname 
            from    ProdData.dbo.Export_Department  
            where   ID > @iMaxId order by ID`
};

export const CustomerDepartment: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerDepartment',
    mapper: {
        customer: 'custoemr@Customer',
        arr1: {
            department: '^deptid@Department',
        }
    },
    pull: ` select top ${promiseSize} custoemr, deptid 
            from    ProdData.dbo.Export_CustomerDepartment  
            where   ID > @iMaxId order by ID`
};

