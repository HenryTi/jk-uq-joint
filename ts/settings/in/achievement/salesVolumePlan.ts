import { uqs } from "../../uqs";
import { UqInMap } from "uq-joint";

export const SalesmanCommissionType: UqInMap = {
    uq: uqs.jkAchievement,
    type: 'map',
    entity: 'SalesmanCommissionType',
    mapper: {
        salesman: 'EmployeeID@Employee',
        arr1: {
            year: '^year',
            commissionType: '^Type',
        }
    },
};


export const SalesVolumePlan: UqInMap = {
    uq: uqs.jkAchievement,
    type: 'map',
    entity: 'SalesVolumePlan',
    mapper: {
        salesman: 'EmployeeID@Employee',
        year: 'YearA',
        arr1: {
            month: '^MonthA',
            salesVolumePlan: '^Amount',
        }
    },
};