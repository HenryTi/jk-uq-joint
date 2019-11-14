import { UqInTuid, UqInMap, Joint } from "uq-joint";
import dateFormat from 'dateformat';
import config from 'config';
import { uqs } from "../uqs";

const promiseSize = config.get<number>("promiseSize");

export const PointProduct: UqInMap = {
    uq: uqs.jkPointShop,
    type: 'map',
    entity: 'PointProduct',
    mapper: {
        product: "ProductID@ProductX",
        arr1: {
            pack: "^PackageID@ProductX_PackX",
            point: "^Point",
            startDate: "^StartDate",
            endDate: "^EndDate"
        }
    },
    pull: `select top ${promiseSize} p.ID, p.PackageID, j.jkid as ProductID, p.Point, p.StartDate, p.EndDate, p.Comments from ProdData.dbo.Export_PointProduct p
    inner join zcl_mess.dbo.jkcat j on j.jkcat = p.PackageID where p.ID > @iMaxId order by ID`,
    pullWrite: async (joint: Joint, data: any) => {
        data["StartDate"] = data["StartDate"] && dateFormat(data["StartDate"], "yyyy-mm-dd HH:MM:ss");
        data["EndDate"] = data["EndDate"] && dateFormat(data["EndDate"], "yyyy-mm-dd HH:MM:ss");
        await joint.uqIn(PointProduct, data);
        return true;
    }
}
