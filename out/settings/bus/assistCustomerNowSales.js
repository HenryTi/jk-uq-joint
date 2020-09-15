"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceAssistCustomerNowSales = void 0;
const tools_1 = require("../../mssql/tools");
/**
 * 客户当前销售导入内部系统
 */
exports.faceAssistCustomerNowSales = {
    face: '百灵威系统工程部/SalesTask/assistCustomerNowSales',
    from: 'local',
    mapper: {
        customer: "customer@Customer",
        webuser: 'webuser',
        sales: "sales",
        createdate: 'createdate',
    },
    push: async (joint, uqBus, queue, data) => {
        let { customer, webuser, sales, createdate } = data;
        var myDate = new Date();
        createdate = createdate ? createdate : myDate.toLocaleString();
        await tools_1.execSql(`exec dbs.dbo.updateTonvaCustomerNowSale @Customer, @WebUser, @Sales, @StartDate;`, [
            { 'name': 'Customer', 'value': customer },
            { 'name': 'WebUser', 'value': webuser },
            { 'name': 'Sales', 'value': sales },
            { 'name': 'StartDate', 'value': createdate },
        ]);
        return true;
    }
};
//# sourceMappingURL=assistCustomerNowSales.js.map