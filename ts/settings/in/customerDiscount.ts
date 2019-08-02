import { UqInTuid, UqInMap, UqInTuidArr, Joint, DataPullResult } from "../../uq-joint";
import { uqs } from "../uqs";
import { execSql } from "../../mssql/tools";
import { uqPullRead, uqOutRead } from "../../first/converter/uqOutRead";
import config from 'config';

const promiseSize = config.get<number>("promiseSize");

export const CustomerDiscount: UqInMap = {
    uq: uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'CustomerDiscount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: string | number): Promise<DataPullResult> => {
        let sql = `select top ${promiseSize} md.ID, a.CID as CustomerID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'C' order by md.Id`;
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                })
                return ret;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export const OrganizationDiscount: UqInMap = {
    uq: uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'OrganizationDiscount',
    mapper: {
        organization: 'OrganizationID@Organization',
        arr1: {
            brand: "^BrandID@Brand",
            discount: "^Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<DataPullResult> => {
        let sql = `select top ${promiseSize} md.ID, a.CID as OrganizationID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'U' order by md.Id`;
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret !== undefined) {
                let { data } = ret;
                data.map(e => {
                    e["StartDate"] = e["StartDate"].getTime();
                    e["EndDate"] = e["EndDate"].getTime();
                })
                return ret;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export const Agreement: UqInMap = {
    uq: uqs.jkCustomerDiscount,
    type: 'map',
    entity: 'Agreement',
    mapper: {
        organization: 'OrganizationID@Organization',
        startDate: 'StartDate',
        endDate: 'EndDate',
    },
    pull: `select top ${promiseSize} ID, AgreementID, CID, ObjType, StartDate, EndDate from ProdData.dbo.Export_Agreement where ID > @iMaxId and objType in ( 'C', 'U' ) order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        let sql = `select a.CID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
                from dbs.dbo.Agreement a
                inner join dbs.dbo.AgreementManuDiscount md on md.AgreementID = a.AgreementID
                where a.AgreementID = @agreementID`;
        let result = undefined;
        try {
            result = await execSql(sql, [{ 'name': 'agreementID', 'value': data['AgreementID'] }]);
        } catch (error) {
            console.error(error);
            throw error;
        }
        if (result !== undefined) {
            let { recordset } = result;
            for (var i = 0; i < recordset.length; i++) {
                let row = recordset[i];
                let { CID, BrandID, Discount, StartDate, EndDate } = row;
                try {
                    if (data['ObjType'] === 'C') {
                        await joint.uqIn(CustomerDiscount, {
                            "CustomerID": CID
                            , "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate.getTime(), "EndDate": EndDate.getTime()
                        });
                    }
                    if (data['ObjType'] === 'U') {
                        await joint.uqIn(OrganizationDiscount, {
                            "OrganizationID": CID
                            , "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate.getTime(), "EndDate": EndDate.getTime()
                        });
                    }
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        }
        return true
    }
};