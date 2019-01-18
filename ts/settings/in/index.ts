import { Country, Province, City, County, Address } from "./Address";
import { SalesRegion, Currency, PackType, PackTypeStandard, PackTypeMapToStandard, Lanugage } from "./salesRegion";
import { Brand, Product, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductPackX, PriceX, BrandSalesRegion, BrandDeliveryTime, ProductChemical } from "./product";
import { Warehouse, SalesRegionWarehouse } from "./warehouse";
import { Chemical } from "./chemical";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPack } from "./promotion";
import { Customer, Organization, OrganizationCustomer, CustomerContact, CustomerConsigneeContact, CustomerInvoiceContact, Contact } from "./customer";
import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "./productCategory";

const _in = {
    'Language': Lanugage,
    'Country': Country,
    'Province': Province,
    'City': City,
    'County': County,
    'Address': Address,
    'Currency': Currency,
    'SalesRegion': SalesRegion,
    'PackType': PackType,
    'PackTypeMapToStandard': PackTypeMapToStandard,
    'PackTypeStandard': PackTypeStandard,

    'Chemical': Chemical,

    'Brand': Brand,
    'BrandSalesRegion': BrandSalesRegion,
    'BrandDeliveryTime': BrandDeliveryTime,

    'Product': Product,
    'ProductChemical': ProductChemical,
    'ProductSalesRegion': ProductSalesRegion,
    'ProductLegallyProhibited': ProductLegallyProhibited,

    /*
    'ProductPackType': ProductPackType,
    'ProductPack': ProductPack,
    'Price': Price,
    */

    'ProductX': ProductX,
    'ProductPackX': ProductPackX,
    'PriceX': PriceX,

    'ProductCategory': ProductCategory,
    'ProductCategoryLanguage': ProductCategoryLanguage,
    'ProductProductCategory': ProductProductCategory,

    'Warehouse': Warehouse,
    'SalesRegionWarehouse': SalesRegionWarehouse,

    'Promotion': Promotion,
    'PromotionSalesRegion': PromotionSalesRegion,
    'PromotionLanguage': PromotionLanguage,
    'PromotionPack': PromotionPack,

    'Customer': Customer,
    'Organization': Organization,
    'OrganizationCustomer': OrganizationCustomer,
    'CustomerContact': CustomerContact,
    'CustomerConsigneeContact': CustomerConsigneeContact,
    'CustomerInvoiceContact': CustomerInvoiceContact,
    'Contact': Contact,
}

export default _in;