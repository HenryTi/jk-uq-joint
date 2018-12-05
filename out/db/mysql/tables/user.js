"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user = {
    name: 'user',
    code: [
        "`id` BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "`name` VARCHAR(100) NOT NULL UNIQUE KEY",
        "`nick` TINYTEXT NULL",
        "`icon` TINYTEXT NULL",
        "`country` SMALLINT(6) NULL DEFAULT NULL",
        "`mobile` BIGINT(20) NULL DEFAULT NULL",
        "`email` VARCHAR(100) NULL DEFAULT NULL",
        "`stamp` INT NOT NULL DEFAULT 0",
    ]
};
exports.default = [
    user
];
//# sourceMappingURL=user.js.map