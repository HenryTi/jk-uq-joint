import { UqBus, Joint, DataPull, DataPullResult } from "uq-joint";
import { uqOutRead } from "../../first/converter/uqOutRead";

export const faceOrderHistory: UqBus = {
    face: '百灵威系统工程部/order/orderHistory',
    from: 'local',
    mapper: {
        orderId: "OrderID",
        orderItemId: "OrderItemID",
        seller: 'SalesCompanyID',
        salesman: 'SalesmanID@Employee',
        salesRegion: "SalesRegionID@SalesRegion",
        customer: "CustomerID@Customer",
        buyerAccount: false, // "BuyerAccountID@BuyerAccount",
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
        有效销售额: "有效销售额",
        税后销售收入: "税后销售收入",
        mark: "Mark",
        抵达日期: "抵达日期",
        createDate: "CreateDate",
    },
    pull: async (joint: Joint, uqBus: UqBus, queue: number): Promise<DataPullResult> => {
        /*
        let step_seconds = 10 * 60;
        if ((queue - 8 * 60 * 60 + step_seconds) * 1000 > Date.now())
            return undefined;
        let nextQueue = queue + step_seconds;
        let sql = `select DATEDIFF(s, '1970-01-01', 合同生成日期) + 1 as ID, '' as SalesCompanyID, 销售代码 as SalesmanID, CID as CustomerID, '' as BuyerAccountID
                , 供应商代码 as BrandID, jkid as ProductID, jkcat as PackID, Qty as Quantity, 销售价格 as Price, 销售币种 as CurrencyID
                , 人民币目录价 as retail, '' as RetailCurrencyID, 有效销售额RMB, 税后销售收入, 抵达日期, 合同生成日期 as CreateDate
                , '' as SalesRegion, SOrderID as OrderID, OrderID as OrderItemID
                from sales.dbo.vw_sys_orders
                where 合同生成日期 >= DATEADD(s, @iMaxId, '1970-01-01') and 合同生成日期 <= DATAADD(s, ${nextQueue}, '1970-01-01')
                order by 合同生成日期`;
        try {
            let ret = await uqOutRead(sql, queue);
            if (ret === undefined)
                ret = { lastPointer: nextQueue, data: [] };
            return ret;
        } catch (error) {
            console.log(error);
            throw error;
        }
        */
        let sql = `select top 1 ID, OrderItemID, OrderID, SalesCompanyID, SalesmanID, SalesRegionID, CustomerID, BuyerAccountID, OrganizationID
                , BrandID, ProductID, PackingID, Quantity, Price, CurrencyID
                , Retail, RetailCurrencyID, BottomPrice, BottomPriceCurrencyID, 有效销售额, 税后销售收入, Mark, 抵达日期, CreateDate
                from ProdData.dbo.Export_SalesOrderItem
                where ID > @iMaxId
                order by ID`;
        return await uqOutRead(sql, queue);
    }
};
