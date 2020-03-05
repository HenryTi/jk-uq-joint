import { UqInMap, Joint, DataPullResult } from "uq-joint";
import dateFormat from 'dateformat';
import { uqs } from "../uqs";
import { execSql } from "../../mssql/tools";
import { uqOutRead } from "../../first/converter/uqOutRead";
import config from 'config';
import { logger } from "../../tools/logger";
import { UqIn } from "uq-joint";

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
                data.forEach(e => {
                    e["StartDate"] = e["StartDate"] && dateFormat(e["StartDate"], 'yyyy-mm-dd HH:MM:ss');
                    e["EndDate"] = e["EndDate"] && dateFormat(e["EndDate"], 'yyyy-mm-dd HH:MM:ss');
                })
                return ret;
            }
        } catch (error) {
            logger.error(error);
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
                data.forEach((e) => {
                    e["StartDate"] = e["StartDate"] && dateFormat(e["StartDate"], 'yyyy-mm-dd HH:MM:ss');
                    e["EndDate"] = e["EndDate"] && dateFormat(e["EndDate"], 'yyyy-mm-dd HH:MM:ss');
                })
                return ret;
            }
        } catch (error) {
            logger.error(error);
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
    pullWrite: async (joint: Joint, uqIn: UqIn, data: any) => {
        let sql = `select a.CID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
                from dbs.dbo.Agreement a
                inner join dbs.dbo.AgreementManuDiscount md on md.AgreementID = a.AgreementID
                where a.AgreementID = @agreementID`;
        let result = undefined;
        try {
            result = await execSql(sql, [{ 'name': 'agreementID', 'value': data['AgreementID'] }]);
        } catch (error) {
            logger.error(error);
            throw error;
        }
        if (result !== undefined) {
            let { recordset } = result;
            for (var i = 0; i < recordset.length; i++) {
                let row = recordset[i];
                let { CID, BrandID, Discount, StartDate, EndDate } = row;
                StartDate = StartDate && dateFormat(StartDate, "yyyy-mm-dd HH:MM:ss");
                EndDate = EndDate && dateFormat(EndDate, "yyyy-mm-dd HH:MM:ss");
                try {
                    if (data['ObjType'] === 'C') {
                        await joint.uqIn(CustomerDiscount, {
                            "CustomerID": CID
                            , "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate, "EndDate": EndDate
                        });
                    }
                    if (data['ObjType'] === 'U') {
                        await joint.uqIn(OrganizationDiscount, {
                            "OrganizationID": CID
                            , "BrandID": BrandID, 'Discount': Discount, "StartDate": StartDate, "EndDate": EndDate
                        });
                    }
                } catch (error) {
                    logger.error(error);
                    throw error;
                }
            }
        }
        return true
    }
};