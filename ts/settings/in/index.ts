import { Country, Province, City, County, Address } from "./Address";
import { SalesRegion, Currency, PackType, PackTypeStandard, PackTypeMapToStandard, Language, InvoiceType } from "./salesRegion";
import {
    Brand, ProductSalesRegion, ProductLegallyProhibited, ProductX, ProductPackX,
    PriceX, AgentPrice, BrandSalesRegion, BrandDeliveryTime, ProductChemical, InvalidProduct,
    ProductMSDSFile, ProductSpecFile, ProductSalesRank
} from "./product";
import { Warehouse, SalesRegionWarehouse, WarehouseRoom, Shelf, ShelfLayer, ShelfBlock } from "./warehouse";
import { Chemical, StorageCondition } from "./chemical";
import { Promotion, PromotionSalesRegion, PromotionLanguage, PromotionPackDiscount, PromotionStatus, PromotionType } from "./promotion";
import {
    Customer, Organization, OrganizationCustomer, CustomerContact, CustomerContacts, Contact, InvoiceInfo,
    CustomerHandler, CustomerContractor, BuyerAccount, CustomerBuyerAccount, Department, CustomerDepartment,
    Position, CustomerResearch, CustomerPosition, CustomerRelatedProducts, Research
} from "./customer";
import { ProductCategory, ProductCategoryLanguage, ProductProductCategory } from "./productCategory";
import { Agreement, CustomerDiscount, OrganizationDiscount } from "./customerDiscount";
import { Employee } from "./hr";
import { JkTaskType, JkTask, Importcustomerdata } from "./salestask";
import { WebUser, WebUserTonva, WebUserContact, WebUserCustomer, WebUserSetting, WebUserSettingAlter, WebUserSettingType, WebUserContacts, WebUserBuyerAccount } from "./webUser";
import { OrganizationVIPLevel } from "./VIPCardLevel";
import { CurrencyExchangeRate } from "./common/currency";
// import { WebUserPointDiff } from "./pointshop";

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
    StorageCondition,

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
    ProductSalesRank,


    Warehouse,                  // 还没有日常的数据交换，变化较小，不必有？
    SalesRegionWarehouse,       // 还没有日常的数据交换，变化较小，不必有？
    WarehouseRoom,
    Shelf,
    ShelfLayer,
    ShelfBlock,

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
    Research,
    CustomerResearch,
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

    Importcustomerdata,

    OrganizationVIPLevel,

    // WebUserPointDiff
    CurrencyExchangeRate,
]

export default uqIns;