"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moniker = {
    name: 'moniker',
    code: [
        "`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "moniker varchar(200)",
        "`in` tinyint default 0",
        "`out` tinyint default 0",
        "UNIQUE INDEX moniker_id(`moniker`, `id`)",
    ],
};
const queue = {
    name: 'queue',
    code: [
        "`id` BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "`moniker` INT NOT NULL",
        "`body` TEXT NOT NULL",
        "date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    ]
};
const faceProcessed = {
    name: 'face_processed',
    code: [
        "face INT NOT NULL",
        "queue BIGINT NOT NULL DEFAULT 0",
        "flag TINYINT",
        "PRIMARY KEY(face, queue)"
    ]
};
exports.default = [
    moniker, queue, faceProcessed
];
//# sourceMappingURL=queue.js.map