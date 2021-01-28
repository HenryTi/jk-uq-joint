"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceOrderChanged = void 0;
const uqOutRead_1 = require("../../../../first/converter/uqOutRead");
const tools_1 = require("../../../../mssql/tools");
const inValidCurrency = ['', '-'];
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
        buyerAccount: "BuyerAccountID@BuyerAccount",
        organization: "OrganizationID@Organization",
        brand: "BrandID@Brand",
        product: "ProductID@ProductX",
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
        tradeType: 'sTradeType',
        taxRate: 'TaxRate',
        promotionId: 'Mtype',
        createDate: "CreateDate",
    },
    pull: async (joint, uqBus, queue) => {
        // Export_SalesOrderItem_OrderId在job："DBA数据交换——派送数据"中更新；
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
                    , isnull(so.UserId, so.CID) as CustomerID, so.CID as BuyerAccountID, null as OrganizationID
                    , p.manufactory as BrandID, j.jkid as ProductID, so.jkcat as PackingID, so.Qty as Quantity
                    , so.UnitPriceRMB as Price, rtrim(so.UnitPriceRMBCurrency) as CurrencyID
                    , so.RMBPrice as Retail, rtrim(so.CatalogPriceCurrency) as RetailCurrencyID
                    , so.bottomLinePrice as BottomPrice, isnull(rtrim(so.bottomLinePriceCurrency), 'RMB') as BottomPriceCurrencyID
                    , so.unitprice as CostPrice, isnull(rtrim(so.CurrencyInv), 'RMB') as CostPriceCurrencyID
                    , so.Mark
                    , so.sTradeType
                    , s.TaxRate
                    , m.Mtype
                    , so.recordTime as CreateDate
                    from ${DBName}.dbo.SOrders so 
                    inner join ${DBName}.dbo.Termsa s on so.SOrderId = s.SOrderID
                    inner join zcl_mess.dbo.jkcat j on j.jkcat = so.jkcat
                    inner join zcl_mess.dbo.products as p on j.jkid = p.jkid
                    left join dbs.dbo.sorders_linkmarket lm on lm.orderid = so.orderid
                    left join dbs.dbo.Marketing m on m.marketingId = lm.marketingId
                    where so.orderId = @orderId`;
            let ret = await tools_1.execSql(sqlstring, [{ name: 'orderId', value: orderItemID }]);
            let { recordset, rowsAffected } = ret;
            if (rowsAffected > 0) {
                recordset.forEach(e => {
                    if (inValidCurrency.indexOf(e.CurrencyID) > -1)
                        e.CurrencyID = undefined;
                    if (inValidCurrency.indexOf(e.RetailCurrencyID) > -1)
                        e.RetailCurrencyID = undefined;
                    if (inValidCurrency.indexOf(e.BottomPriceCurrencyID) > -1)
                        e.BottomPriceCurrencyID = undefined;
                    if (inValidCurrency.indexOf(e.CostPriceCurrencyID) > -1)
                        e.CostPriceCurrencyID = undefined;
                    e.CreateDate = e.CreateDate / 1000;
                });
                return { lastPointer: newQueue, data: recordset };
            }
        }
    }
};
//# sourceMappingURL=orderChanged.js.map