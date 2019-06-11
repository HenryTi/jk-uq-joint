import { Country, Province, City, County, Address } from "./Address";
import { SalesRegion, Currency, PackType, PackTypeStandard, PackTypeMapToStandard, Language, InvoiceType } from "./salesRegion";
import { Brand, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductPackX, PriceX, BrandSalesRegion, BrandDeliveryTime, ProductChemical, InvalidProduct } from "./product";
import { Warehouse, SalesRegionWarehouse } from "./warehouse";
import { Chemical } from "./chemical";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPackDiscount, PromotionStatus, PromotionType } from "./promotion";
import { Customer, Organization, OrganizationCustomer, CustomerContact, CustomerContacts, Contact, InvoiceInfo, CustomerHandler } from "./customer";
import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "./productCategory";
import { Agreement, CustomerDiscount, OrganizationDiscount } from "./customerDiscount";
import { Employee } from "./hr";

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
    InvoiceType,

    Employee,

    Chemical,

    Brand,
    BrandSalesRegion,
    BrandDeliveryTime,

    /*
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

    PromotionType,
    PromotionStatus,
    Promotion,
    PromotionSalesRegion,
    PromotionLanguage,
    PromotionPackDiscount,

    Customer,
    Organization,
    OrganizationCustomer,
    CustomerContact,
    CustomerContacts,
    CustomerHandler,
    Contact,
    InvoiceInfo,

    Agreement,
    CustomerDiscount,
    OrganizationDiscount,
    */
]

export default uqIns;