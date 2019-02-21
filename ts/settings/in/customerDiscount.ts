import { UqInTuid, UqInMap, UqInTuidArr, Joint } from "../../uq-joint";
import { uqs } from "../uqs";
import { execSql } from "../../mssql/tools";
import { uqPullRead } from "../../first/converter/uqOutRead";

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
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<{ queue: number, data: any }> => {
        let sql = `select top 1 md.ID, a.CID as CustomerID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'C' order by md.Id`
        let ret = await uqPullRead(sql, queue);
        if (ret !== undefined) {
            let { data } = ret;
            data["StartDate"] = data["StartDate"].getTime();
            data["EndDate"] = data["EndDate"].getTime();
            return ret;
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
            brand: "BrandID@Brand",
            discount: "Discount",
            startDate: "^StartDate",
            endDate: "^EndDate",
        }
    },
    pull: async (joint: Joint, uqIn: UqInMap, queue: number): Promise<{ queue: number, data: any }> => {
        let sql = `select top 1 md.ID, a.CID as OrgnizationID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
        from ProdData.dbo.Export_AgreementManuDiscount md
        inner join dbs.dbo.Agreement a on md.AgreementID = a.AgreementID
        where md.ID > @iMaxId and a.objType = 'U' order by md.Id`
        let ret = await uqPullRead(sql, queue);
        if (ret !== undefined) {
            let { data } = ret;
            data["StartDate"] = data["StartDate"].getTime();
            data["EndDate"] = data["EndDate"].getTime();
            return ret;
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
    pull: `select top 1 ID, AgreementID, CID, ObjType, StartDate, EndDate from ProdData.dbo.Export_Agreement where ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        try {
            let sql = `select a.CID, md.Manu as BrandID, md.DiscountValue as Discount, a.StartDate, a.EndDate
                from dbs.dbo.Agreement a
                inner join dbs.dbo.AgreementManuDiscount md on md.AgreementID = a.AgreementID
                where a.AgreementID = @agreementID`;
            let result = await execSql(sql, [{ 'name': 'agreementID', 'value': data['AgreementID'] }]);
            if (result !== undefined) {
                let { recordset } = result;
                for (var i = 0; i < recordset.length; i++) {
                    let row = recordset[i];
                    let { CID, BrandID, Discount, StartDate, EndDate } = row;
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
                }
            }
        return true
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};