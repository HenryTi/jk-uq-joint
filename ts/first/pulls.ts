import { sqls } from './converter/sqls';
import { UqIn, DataPullResult } from "uq-joint";

import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "../settings/in/productCategory";
import { Country, Province, City, County } from "../settings/in/Address";
import { Language, PackTypeStandard, Currency, SalesRegion, PackType, InvoiceType } from "../settings/in/salesRegion";
import { Chemical } from "../settings/in/chemical";
import { Brand, ProductLegallyProhibited, ProductX, ProductExtensionProperty, ProductMSDSFile, ProductSpecFile } from "../settings/in/product";
import { Warehouse, SalesRegionWarehouse, WarehouseRoom, Shelf, ShelfLayer, ShelfBlock } from "../settings/in/warehouse";
import { Organization, Customer, Contact, BuyerAccount, CustomerBuyerAccount, CustomerContact } from "../settings/in/customer";
import { Promotion, PromotionType, PromotionStatus } from '../settings/in/promotion';
import { Agreement } from '../settings/in/customerDiscount';
import { Employee } from '../settings/in/hr';
//import { PointShopOrder } from 'settings/in/pointshop';
import { OrganizationVIPLevel } from 'settings/in/VIPCardLevel';
import { ChemicalSynonmity } from 'settings/in/chemical/chemicalSynonymity';
import { SalesmanCommissionType, SalesVolumePlan } from 'settings/in/achievement/salesVolumePlan';
import { BrandMinDiscount } from 'settings/in/pointshop/brandMinDiscount';

/**
 * joint的思路是：joint一直在运行，每隔一段时间执行一次数据交换，数据交换分为3种，
 * 从远处数据源发送到Tonva中的，称为in，其步骤是：
 *  1.通过配置UqOutConvert，从数据源中获取要交换的数据，通过配置uqIn，表示源数据要进行的格式转换以及目的地
 */

export type UqOutConverter = (maxId: string) => Promise<DataPullResult>;

/** */
export const pulls: {
    [name: string]: {
        /**
         * 用于从获取数据源表中的数据，如果是string，则为获取数据的Sql语句；
         */
        read: UqOutConverter | string,
        /**
         * 包含将源数据转换为目的数据、发送源数据到目的数据等的相关设置
         */
        uqIn: UqIn
    }
} = {
    "Language": { read: sqls.readLanguage, uqIn: Language },
    "Country": { read: sqls.readCountry, uqIn: Country },
    "Province": { read: sqls.readProvince, uqIn: Province },
    "City": { read: sqls.readCity, uqIn: City },
    "County": { read: sqls.readCounty, uqIn: County },
    "PackTypeStandard": { read: sqls.readPackTypeStandard, uqIn: PackTypeStandard },
    "PackType": { read: sqls.readPackType, uqIn: PackType },
    "Currency": { read: sqls.readCurrency, uqIn: Currency },
    "SalesRegion": { read: sqls.readSalesRegion, uqIn: SalesRegion },
    "InvoiceType": { read: sqls.readInvoiceType, uqIn: InvoiceType },
    "Employee": { read: sqls.readEmployee, uqIn: Employee },

    // 库存
    "Warehouse": { read: sqls.readWarehouse, uqIn: Warehouse },
    "SalesRegionWarehouse": { read: sqls.readSalesRegionWarehouse, uqIn: SalesRegionWarehouse },
    "WarehouseRoom": { read: sqls.readWarehouseRoom, uqIn: WarehouseRoom },
    "Shelf": { read: sqls.readShelf, uqIn: Shelf },
    "ShelfLayer": { read: sqls.readShelfLayer, uqIn: ShelfLayer },
    "ShelfBlock": { read: undefined, uqIn: ShelfBlock },

    // 产品相关的数据表
    // 目录树
    "ProductCategory": { read: sqls.readProductCategory, uqIn: ProductCategory },
    "ProductCategoryLanguage": { read: sqls.readProductCategoryLanguage, uqIn: ProductCategoryLanguage },
    "ProductProductCategory": { read: sqls.readProductProductCategory, uqIn: ProductProductCategory },

    // 品牌
    "Brand": { read: sqls.readBrand, uqIn: Brand },
    "Chemical": { read: sqls.readChemical, uqIn: Chemical },
    "ChemicalSynonmity": { read: sqls.readChemicalSynonmity, uqIn: ChemicalSynonmity },

    // 产品
    "ProductX": { read: sqls.readProduct, uqIn: ProductX },
    "ProductLegallyProhibited": { read: sqls.readProductLegallyProhibited, uqIn: ProductLegallyProhibited },
    "ProductExtensionProperty": { read: sqls.readProductExtensionProperty, uqIn: ProductExtensionProperty },

    "ProductMSDSFile": { read: sqls.readProductMSDSFile, uqIn: ProductMSDSFile },
    "ProductSpecFile": { read: sqls.readProductSpecFile, uqIn: ProductSpecFile },

    // 客户和客户单位基本信息
    "Organization": { read: sqls.readOrganization, uqIn: Organization },
    "Customer": { read: sqls.readCustomer, uqIn: Customer },
    "CustomerContactEmail1": { read: sqls.readCustomerContactEmail1, uqIn: CustomerContact },
    "BuyerAccount": { read: sqls.readBuyerAccount, uqIn: BuyerAccount },
    "CustomerShippingAddress": { read: sqls.readCustomerShippingAddress, uqIn: Contact },
    "CustomerInvoiceAddress": { read: sqls.readCustomerInvoiceAddress, uqIn: Contact },
    "CustomerBuyerAccount": { read: sqls.readCustomerBuyerAccount, uqIn: CustomerBuyerAccount },

    "Agreement": { read: sqls.readAgreement, uqIn: Agreement },

    // 市场活动
    "PromotionType": { read: sqls.readPromotionType, uqIn: PromotionType },
    "PromotionStatus": { read: sqls.readPromotionStatus, uqIn: PromotionStatus },
    "Promotion": { read: sqls.readPromotion, uqIn: Promotion },

    //"SaleOrder": { read: sqls.readSaleOrder, uqIn: PointShopOrder },

    // 
    "OrganizationVIPLevel": { read: sqls.readOrganizationVIPLevel, uqIn: OrganizationVIPLevel },

    // 
    "SalesmanCommissionType": { read: sqls.readSalesmanCommissionType, uqIn: SalesmanCommissionType },
    "SalesVolumePlan": { read: sqls.readSalesVolumePlan, uqIn: SalesVolumePlan },

    "BrandMinDiscount": { read: sqls.readBrandMinDiscount, uqIn: BrandMinDiscount }
}