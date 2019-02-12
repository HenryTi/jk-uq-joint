import { sqls } from './converter/sqls';
import { Joint, UqIn } from "../uq-joint";

import { productPullWrite } from "./converter/productPullWrite";
import { readChemical } from './converter/chemicalConverter';
import { readPackTypeStandard, readPackType } from './converter/commonConverter';
import { PackTypePullWrite } from "./converter/commonPullWrite";
import { customerPullWrite, consigneeContactPullWrite } from "./converter/customerPullWrite";

import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "../settings/in/productCategory";
import { Country, Province, City, County } from "../settings/in/Address";
import { Language, PackTypeStandard, Currency, SalesRegion } from "../settings/in/salesRegion";
import { Chemical } from "../settings/in/chemical";
import { Brand, BrandSalesRegion, BrandDeliveryTime, ProductPackX, PriceX, ProductSalesRegion, ProductLegallyProhibited } from "../settings/in/product";
import { Warehouse, SalesRegionWarehouse } from "../settings/in/warehouse";
import { Organization } from "../settings/in/customer";

/**
 * joint的思路是：joint一直在运行，每隔一段时间执行一次数据交换，数据交换分为3种，
 * 从远处数据源发送到Tonva中的，称为in，其步骤是：
 *  1.通过配置UqOutConvert，从数据源中获取要交换的数据，通过配置uqIn，表示源数据要进行的格式转换以及目的地
 */

export type UqOutConverter = (maxId: string) => Promise<{ lastId: string, data: any }>;
export type PullWrite = (join: Joint, data: any) => Promise<void>;

/** */
export const pulls: { read: UqOutConverter | string, uqIn: UqIn | PullWrite }[] = [
    { read: sqls.readLanguage, uqIn: Language },
    { read: sqls.readCountry, uqIn: Country },
    { read: sqls.readProvince, uqIn: Province },
    { read: sqls.readCity, uqIn: City },
    { read: sqls.readCounty, uqIn: County },
    { read: readPackTypeStandard, uqIn: PackTypeStandard },
    { read: readPackType, uqIn: PackTypePullWrite },
    { read: sqls.readCurrency, uqIn: Currency },
    { read: sqls.readSalesRegion, uqIn: SalesRegion },
    { read: readChemical, uqIn: Chemical },

    // 产品相关的数据表
    { read: sqls.readBrand, uqIn: Brand },
    { read: sqls.readBrandSalesRegion, uqIn: BrandSalesRegion },
    { read: sqls.readBrandDeliveryTime, uqIn: BrandDeliveryTime },
    { read: sqls.readProduct, uqIn: productPullWrite },
    // { read: readPack, uqIn: 'ProductPack' },
    // { read: readPrice, uqIn: 'Price' },
    { read: sqls.readPack, uqIn: ProductPackX },
    { read: sqls.readPrice, uqIn: PriceX },
    { read: sqls.readProductSalesRegion, uqIn: ProductSalesRegion },
    { read: sqls.readProductLegallyProhibited, uqIn: ProductLegallyProhibited },
    // 目录树
    { read: sqls.readProductCategory, uqIn: ProductCategory },
    { read: sqls.readProductCategoryLanguage, uqIn: ProductCategoryLanguage },
    { read: sqls.readProductProductCategory, uqIn: ProductProductCategory },

    // 库存
    { read: sqls.readWarehouse, uqIn: Warehouse },
    { read: sqls.readSalesRegionWarehouse, uqIn: SalesRegionWarehouse },

    // { read: readPromotion, uqIn: promotionPullWrite },
    // { read: readPromotionLanguage, uqIn: 'PromotionLanguage' },
    // { read: readPromotionPack, uqIn: 'PromotionPack' },

    // 客户和客户单位基本信息
    { read: sqls.readOrganization, uqIn: Organization },
    { read: sqls.readCustomer, uqIn: customerPullWrite },
    // 使用subTuid的导数据代码
    // { read: readCustomerConsigneeContact, uqIn: 'CustomerConsigneeContact' },
    // { read: readCustomerInvoiceContact, uqIn: 'CustomerInvoiceContact' },
    // 使用map方式的导数据代码
    { read: sqls.readCustomerConsigneeContact, uqIn: consigneeContactPullWrite },
    { read: sqls.readCustomerInvoiceContact, uqIn: consigneeContactPullWrite },
]