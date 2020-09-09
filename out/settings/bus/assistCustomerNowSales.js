"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceAssistCustomerNowSales = void 0;
const tools_1 = require("../../mssql/tools");
/**
 * 客户当前销售导入内部系统
 */
exports.faceAssistCustomerNowSales = {
    face: '百灵威系统工程部/pointShop/assistCustomerNowSales',
    from: 'local',
    mapper: {
        customer: "customer@Customer",
        sales: "sales",
        startdate: 'startdate',
    },
    push: async (joint, uqBus, queue, data) => {
        let { customer, sales, startdate } = data;
        await tools_1.execSql(` exec dbs.dbo.updateTonvaCustomerNowSale @Customer, @Sales, @StartDate `, [
            { 'name': 'Customer', 'value': customer },
            { 'name': 'Sales', 'value': sales },
            { 'name': 'StartDate', 'value': startdate },
        ]);
        return true;
    }
};
//# sourceMappingURL=assistCustomerNowSales.js.map