import { Country, Province, City, County, Address } from "./Address";
import { SalesRegion, Currency, PackType, PackTypeStandard, PackTypeMapToStandard, Language } from "./salesRegion";
import { Brand, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductPackX, PriceX, BrandSalesRegion, BrandDeliveryTime, ProductChemical, InvalidProduct } from "./product";
import { Warehouse, SalesRegionWarehouse } from "./warehouse";
import { Chemical } from "./chemical";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPack } from "./promotion";
import { Customer, Organization, OrganizationCustomer, CustomerContact, CustomerContacts, Contact } from "./customer";
import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "./productCategory";
import { Agreement, CustomerDiscount, OrganizationDiscount } from "./customerDiscount";

const uqIns = [
    Language,
    Country,
    Province,
    City,
    County,
    Address,
    Currency,
    SalesRegion,
    PackType,
    PackTypeMapToStandard,
    PackTypeStandard,

    Chemical,

    Brand,
    BrandSalesRegion,
    BrandDeliveryTime,

    ProductX,
    InvalidProduct,
    ProductChemical,
    ProductPackX,
    PriceX,
    ProductSalesRegion,
    ProductLegallyProhibited,

    ProductCategory,
    ProductCategoryLanguage,
    ProductProductCategory,

    Warehouse,
    SalesRegionWarehouse,

    Promotion,
    PromotionSalesRegion,
    PromotionLanguage,
    PromotionPack,

    Customer,
    Organization,
    OrganizationCustomer,
    CustomerContact,
    CustomerContacts,
    Contact,

    Agreement,
    CustomerDiscount,
    OrganizationDiscount,
]

export default uqIns;