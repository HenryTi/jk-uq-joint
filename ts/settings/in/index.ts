import { Country, Province, City, County, Address } from "./Address";
import { SalesRegion, Currency, PackType, PackTypeStandard, PackTypeMapToStandard, Language, InvoiceType } from "./salesRegion";
import {
    Brand, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductPackX,
    PriceX, AgentPrice, BrandSalesRegion, BrandDeliveryTime, ProductChemical, InvalidProduct,
    ProductMSDSFile, ProductSpecFile
} from "./product";
import { Warehouse, SalesRegionWarehouse } from "./warehouse";
import { Chemical } from "./chemical";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPackDiscount, PromotionStatus, PromotionType } from "./promotion";
import {
    Customer, Organization, OrganizationCustomer, CustomerContact, CustomerContacts, Contact, InvoiceInfo,
    CustomerHandler, CustomerContractor, BuyerAccount, CustomerBuyerAccount, Department, CustomerDepartment,
    Position, CustomerDomain, CustomerPosition
} from "./customer";
import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "./productCategory";
import { Agreement, CustomerDiscount, OrganizationDiscount } from "./customerDiscount";
import { Employee } from "./hr";
import { JkTaskType, JkTask, Importcustomerdata } from "./salestask";
import { WebUser, WebUserTonva, WebUserContact, WebUserCustomer, WebUserSetting, WebUserSettingAlter, WebUserSettingType, WebUserContacts, WebUserBuyerAccount } from "./webUser";
import { PointProduct, PointShopOrder } from "./pointshop";
import { OrganizationVIPLevel } from "./VIPCardLevel";

const uqIns = [

    JkTaskType,
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

    ProductX,
    InvalidProduct,
    ProductChemical,
    ProductPackX,
    PriceX,
    AgentPrice,
    ProductSalesRegion,
    ProductLegallyProhibited,    // 还没有日常的数据交换

    ProductCategory,
    ProductCategoryLanguage,
    ProductProductCategory,

    ProductMSDSFile,
    ProductSpecFile,

    Warehouse,                  // 还没有日常的数据交换，变化较小，不必有？
    SalesRegionWarehouse,       // 还没有日常的数据交换，变化较小，不必有？

    PromotionType,
    PromotionStatus,
    Promotion,
    PromotionSalesRegion,
    PromotionLanguage,
    PromotionPackDiscount,

    Customer,
    Organization,
    BuyerAccount,
    OrganizationCustomer,
    CustomerContact,
    CustomerContacts,
    CustomerHandler,
    CustomerContractor,
    CustomerBuyerAccount,
    Contact,
    InvoiceInfo,
    Department,
    CustomerDepartment,
    CustomerDomain,
    Position,
    CustomerPosition,

    Agreement,
    CustomerDiscount,
    OrganizationDiscount,

    WebUserTonva,
    WebUser,
    WebUserContact,
    WebUserContacts,
    WebUserCustomer,
    WebUserBuyerAccount,
    WebUserSettingType,
    WebUserSetting,
    WebUserSettingAlter,

    JkTask,

    PointProduct,
    PointShopOrder,
    Importcustomerdata,

    OrganizationVIPLevel,
]

export default uqIns;