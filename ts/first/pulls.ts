import { readCountry, readProvince, readCity, readCounty, readPackType, readCurrency, readSalesRegion, readPackTypeStandard, readLanguage } from "./converter/commonConverter";
import { readBrand, readProduct, readPack, readPrice, readProductSalesRegion, readProductLegallyProhibited, readBrandSalesRegion, readBrandDeliveryTime } from "./converter/productConverter";
import { productPullWrite } from "./converter/productPullWrite";
import { Joint } from "../usq-joint";
import { readWarehouse, readSalesRegionWarehouse } from "./converter/warehouseConverter";
import { readChemical } from "./converter/chemicalConverter";
import { PackTypePullWrite } from "./converter/commonPullWrite";
import { readPromotion, readPromotionLanguage, readPromotionPack, promotionPullWrite } from "./converter/promotionConveter";
import { readCustomer, readOrgnization, readCustomerConsigneeContact, readCustomerInvoiceContact } from "./converter/customerConveter";
import { customerPullWrite } from "./converter/customerPullWrite";

export type UsqOutConverter = (maxId: string) => Promise<{ lastId: string, data: any }>;
export type PullWrite = (join:Joint, data:any) => Promise<void>;
export const pulls: { read: UsqOutConverter, usqIn: string | PullWrite }[] = [
    /*
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

    { read: readWarehouse, usqIn: "Warehouse" },
    { read: readSalesRegionWarehouse, usqIn: 'SalesRegionWarehouse'},

    { read: readPromotion, usqIn: promotionPullWrite },
    { read: readPromotionLanguage, usqIn: 'PromotionLanguage' },
    { read: readPromotionPack, usqIn: 'PromotionPack' },
    */

    { read: readOrgnization, usqIn: 'Organization' },
    { read: readCustomer, usqIn: customerPullWrite },
    { read: readCustomerConsigneeContact, usqIn: 'CustomerConsigneeContact' },
    { read: readCustomerInvoiceContact, usqIn: 'CustomerInvoiceContact' },
]