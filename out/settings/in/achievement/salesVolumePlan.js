"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesVolumePlan = exports.SalesmanCommissionType = void 0;
const uqs_1 = require("settings/uqs");
exports.SalesmanCommissionType = {
    uq: uqs_1.uqs.jkAchievement,
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
exports.SalesVolumePlan = {
    uq: uqs_1.uqs.jkAchievement,
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
//# sourceMappingURL=salesVolumePlan.js.map