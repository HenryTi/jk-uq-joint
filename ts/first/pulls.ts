import { readCountry, readProvince, readCity, readCounty, readPackType, readCurrency, readSalesRegion, readPackTypeStandard, readLanguage } from "./converter/commonConverter";
import { readBrand, readProduct, readPack, readPrice, readProductSalesRegion, readProductLegallyProhibited, readBrandSalesRegion, readBrandDeliveryTime } from "./converter/productConverter";
import { productPullWrite } from "./converter/productPullWrite";
import { Joint } from "../usq-joint";
import { readWarehouse, readSalesRegionWarehouse } from "./converter/warehouseConverter";
import { readChemical } from "./converter/chemicalConverter";
import { PackTypePullWrite } from "./converter/commonPullWrite";
import { readPromotion, readPromotionLanguage, readPromotionPack, promotionPullWrite } from "./converter/promotionConveter";
import { readCustomer, readOrganization, readCustomerConsigneeContact, readCustomerInvoiceContact } from "./converter/customerConveter";
import { customerPullWrite, consigneeContactPullWrite, invoiceContactPullWrite } from "./converter/customerPullWrite";
import { readProductCategory, readProductCategoryLanguage, readProductProductCategory } from "./converter/productCategoryConvert";

/**
 * joint的思路是：joint一致在运行，每隔一段时间执行一次数据交换，数据交换分为3种，
 * 从远处数据源发送到Tonva中的，称为in，其步骤是：
 *  1.通过配置UsqOutConvert，从数据源中获取要交换的数据，通过配置UsqIn，表示源数据要进行的格式转换以及目的地
 */

export type UsqOutConverter = (maxId: string) => Promise<{ lastId: string, data: any }>;
export type PullWrite = (join:Joint, data:any) => Promise<void>;

/** */
export const pulls: { read: UsqOutConverter, usqIn: string | PullWrite }[] = [
    { read: readLanguage, usqIn: 'Language' },
    { read: readCountry, usqIn: 'Country' },
    { read: readProvince, usqIn: 'Province' },
    { read: readCity, usqIn: 'City' },
    { read: readCounty, usqIn: 'County' },
    { read: readPackTypeStandard, usqIn: 'PackTypeStandard' },
    { read: readPackType, usqIn: PackTypePullWrite },

    { read: readCurrency, usqIn: 'Currency' },
    { read: readSalesRegion, usqIn: 'SalesRegion' },
    { read: readChemical, usqIn: 'Chemical' },

    // 产品相关的数据表
    { read: readBrand, usqIn: 'Brand' },
    { read: readBrandSalesRegion, usqIn: 'BrandSalesRegion' },
    { read: readBrandDeliveryTime, usqIn: 'BrandDeliveryTime' },
    { read: readProduct, usqIn: productPullWrite },
    { read: readProductSalesRegion, usqIn: 'ProductSalesRegion' },
    { read: readProductLegallyProhibited, usqIn: 'ProductLegallyProhibited' },
    // { read: readPack, usqIn: 'ProductPack' },
    // { read: readPrice, usqIn: 'Price' },
    { read: readPack, usqIn: 'ProductPackX' },
    { read: readPrice, usqIn: 'PriceX' },

    // 目录树
    { read: readProductCategory, usqIn: 'ProductCategory' },
    { read: readProductCategoryLanguage, usqIn: 'ProductCategoryLanguage' },
    { read: readProductProductCategory, usqIn: 'ProductProductCategory' },

    // 库存
    { read: readWarehouse, usqIn: "Warehouse" },
    { read: readSalesRegionWarehouse, usqIn: 'SalesRegionWarehouse'},

    { read: readPromotion, usqIn: promotionPullWrite },
    { read: readPromotionLanguage, usqIn: 'PromotionLanguage' },
    { read: readPromotionPack, usqIn: 'PromotionPack' },

    // 客户和客户单位基本信息
    { read: readOrganization, usqIn: 'Organization' },
    { read: readCustomer, usqIn: customerPullWrite },
    // 使用subTuid的导数据代码
    { read: readCustomerConsigneeContact, usqIn: 'CustomerConsigneeContact' },
    { read: readCustomerInvoiceContact, usqIn: 'CustomerInvoiceContact' },
    // 使用map方式的导数据代码
    { read: readCustomerConsigneeContact, usqIn: consigneeContactPullWrite },
    { read: readCustomerInvoiceContact, usqIn: invoiceContactPullWrite },
]