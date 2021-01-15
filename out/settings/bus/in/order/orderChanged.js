"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOrderChanged = void 0;
const uqOutRead_1 = require("../../../../first/converter/uqOutRead");
const tools_1 = require("mssql/tools");
exports.faceOrderChanged = {
    face: '百灵威系统工程部/orderChanged/orderChanged',
    from: 'local',
    mapper: {
        orderId: "OrderID",
        orderItemId: "OrderItemID",
        seller: 'SalesCompanyID',
        salesman: 'SalesmanID@Employee',
        salesRegion: "SalesRegionID@SalesRegion",
        customer: "CustomerID@Customer",
        buyerAccount: false,
        organization: "OrganizationID@Organization",
        pack: "PackingID@ProductX_PackX",
        quantity: "Quantity",
        price: "Price",
        currency: "CurrencyID@Currency",
        retail: "Retail",
        retailCurrency: "RetailCurrencyID@Currency",
        bottomPrice: "BottomPrice",
        bottomPriceCurrency: "BottomPriceCurrencyID@Currency",
        costPrice: "CostPrice",
        costPriceCurrency: "CostPriceCurrencyID@Currency",
        mark: "Mark",
        taxRate: 'TaxRate',
        tradeType: 'sTradeType',
        promotionId: 'PromotionID',
        createDate: "CreateDate",
    },
    pull: async (joint, uqBus, queue) => {
        let sql = `select top 1 ID, orderItemID, DBName, operationType
                from ProdData.dbo.Export_SalesOrderItem_OrderId
                where   ID > @iMaxId
                order by ID`;
        let result = await uqOutRead_1.uqPullRead(sql, queue);
        if (result) {
            let { queue: newQueue, data } = result;
            let { orderItemID, DBName, operationType } = data;
            let sqlstring = `select top 1 ${newQueue} as ID, so.orderID as OrderItemID, so.SorderID as OrderID
                    , s.SaleCompany as SalesCompanyID, s.epid as SalesmanID, s.[location] as SalesRegionID
                    , so.CID as CustomerID, null as BuyerAccountID, null as OrganizationID
                    , so.jkcat as PackingID, so.Qty as Quantity
                    , so.UnitPriceRMB as Price, so.UnitPriceRMBCurrency as CurrencyID
                    , so.RMBPrice as Retail, so.CatalogPriceCurrency as RetailCurrencyID
                    , so.bottomLinePrice as BottomPrice, so.bottomLinePriceCurrency as BottomPriceCurrencyID
                    , so.unitprice as CostPrice, so.currencyInv as CostPriceCurrencyID
                    , so.Mark
                    , so.sTradeType
                    , s.TaxRate
                    , so.recordTime as CreateDate
                    from ${DBName}.dbo.SOrders so 
                    inner join ${DBName}.dbo.Termsa s on so.SOrderId = s.SOrderID
                    where so.orderId = @orderId`;
            let ret = await tools_1.execSql(sqlstring, [{ name: 'orderId', value: orderItemID }]);
            let { recordset, rowsAffected } = ret;
            if (rowsAffected > 0) {
                return { lastPointer: newQueue, data: recordset };
            }
        }
    }
};
//# sourceMappingURL=orderChanged.js.map