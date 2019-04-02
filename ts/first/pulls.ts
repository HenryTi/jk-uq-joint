import { sqls } from './converter/sqls';
import { UqIn } from "../uq-joint";

import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "../settings/in/productCategory";
import { Country, Province, City, County } from "../settings/in/Address";
import { Language, PackTypeStandard, Currency, SalesRegion, PackType } from "../settings/in/salesRegion";
import { Chemical } from "../settings/in/chemical";
import { Brand, BrandSalesRegion, BrandDeliveryTime, ProductPackX, PriceX, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductChemical } from "../settings/in/product";
import { Warehouse, SalesRegionWarehouse } from "../settings/in/warehouse";
import { Organization, Customer, Contact } from "../settings/in/customer";
import { Promotion, PromotionLanguage, PromotionPack } from '../settings/in/promotion';
import { Agreement } from '../settings/in/customerDiscount';

/**
 * joint的思路是：joint一直在运行，每隔一段时间执行一次数据交换，数据交换分为3种，
 * 从远处数据源发送到Tonva中的，称为in，其步骤是：
 *  1.通过配置UqOutConvert，从数据源中获取要交换的数据，通过配置uqIn，表示源数据要进行的格式转换以及目的地
 */

export type UqOutConverter = (maxId: string) => Promise<{ lastId: string, data: any }>;

/** */
export const pulls: { read: UqOutConverter | string, uqIn: UqIn }[] = [
    /*
    { read: sqls.readLanguage, uqIn: Language },
    { read: sqls.readCountry, uqIn: Country },
    { read: sqls.readProvince, uqIn: Province },
    { read: sqls.readCity, uqIn: City },
    { read: sqls.readCounty, uqIn: County },
    { read: sqls.readPackTypeStandard, uqIn: PackTypeStandard },
    { read: sqls.readPackType, uqIn: PackType},
    { read: sqls.readCurrency, uqIn: Currency },
    { read: sqls.readSalesRegion, uqIn: SalesRegion },

    // 库存
    { read: sqls.readWarehouse, uqIn: Warehouse },
    { read: sqls.readSalesRegionWarehouse, uqIn: SalesRegionWarehouse },

    // 产品相关的数据表
    // 品牌
    { read: sqls.readBrand, uqIn: Brand },
    // 目录树
    { read: sqls.readProductCategory, uqIn: ProductCategory },
    { read: sqls.readProductCategoryLanguage, uqIn: ProductCategoryLanguage },
    */
    // { read: sqls.readChemical, uqIn: Chemical },
    // 产品
    // { read: sqls.readProduct, uqIn: ProductX },
    { read: sqls.readProduct, uqIn: ProductChemical },
    /*
    // 客户和客户单位基本信息
    { read: sqls.readOrganization, uqIn: Organization },
    { read: sqls.readCustomer, uqIn: Customer },
    // 使用map方式的导数据代码
    { read: sqls.readCustomerConsigneeContact, uqIn: Contact },
    { read: sqls.readCustomerInvoiceContact, uqIn: Contact },

    { read: sqls.readAgreement, uqIn: Agreement },
    */

    /*
    // 市场活动
    { read: sqls.readPromotion, uqIn: Promotion },
    { read: sqls.readPromotionLanguage, uqIn: PromotionLanguage },
    { read: sqls.readPromotionPack, uqIn: PromotionPack },
    */
]