import _ from 'lodash';
import { UqBus, DataPush, Joint } from "uq-joint";
import { execSql } from '../../mssql/tools';


/**
 * 客户当前销售导入内部系统
 */
export const faceAssistCustomerNowSales: UqBus = {
    face: '百灵威系统工程部/pointShop/assistCustomerNowSales',
    from: 'local',
    mapper: {
        customer: "customer@Customer",
        sales: "sales",
        startdate: 'startdate',
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { customer, sales, startdate } = data;
        await execSql(` exec dbs.dbo.updateTonvaCustomerNowSale @Customer, @Sales, @StartDate `, [
            { 'name': 'Customer', 'value': customer },
            { 'name': 'Sales', 'value': sales },
            { 'name': 'StartDate', 'value': startdate },
        ])
        return true;
    }
};
