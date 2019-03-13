/*
import { UqOutConverter } from "../pulls";
import { read } from './uqOutRead'

export const readWarehouse: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 CompanyID as ID, companyName as WarehouseName, companyAddr
        from dbs.dbo.Scompany where CompanyID > '${maxId}' order by CompanyId`;
    return await read(sqlstring);
};

export const readSalesRegionWarehouse: UqOutConverter = async (maxId: string): Promise<{ lastId: string, data: any }> => {

    let sqlstring = `select top 1 ID, CompanyID as WarehouseID, Location as SalesRegionID, minDeliverTime, maxDeliverTime
        from dbs.dbo.CompanyLocation where ID > '${maxId}' order by Id`;
    return await read(sqlstring);
};
*/ 
//# sourceMappingURL=warehouseConverter.js.map