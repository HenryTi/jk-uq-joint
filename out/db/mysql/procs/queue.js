"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readQueue = {
    name: 'read_queue',
    params: [
        "_moniker varchar(200)",
        "_queue bigint",
    ],
    label: '_exit',
    code: `
    select a.id, b.moniker, a.boday
        from queue a join moniker b on a.moniker=b.id
        where b.moniker=_moniker and a.id>_queue
        limit 1;
`
};
const writeQueue = {
    name: 'write_queue',
    params: [
        "_moniker varchar(200)",
        "_body text"
    ],
    label: '_exit',
    code: `
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    insert into queue (moniker, body) values (_monikerId, _body);
`
};
const readFaceProcessed = {
    name: 'read_face_processed',
    params: [
        "_face varchar(200)",
    ],
    label: '_exit',
    code: `
    select a.queue
        from face_processed a join moniker b on a.face=b.id
        where b.moniker=_face;
`
};
const writeFaceProcessed = {
    name: 'write_face_processed',
    params: [
        "_face varchar(200)",
        "_queue BIGINT"
    ],
    label: '_exit',
    code: `
    declare _faceId int;
    select a.id into _faceId from moniker as a where a.moniker=_face;
    insert into face_processed (face, queue)
        values (_faceId, _queue)
        on duplicate key update ex=0;
`
};
exports.default = [readQueue, writeQueue, readFaceProcessed, writeFaceProcessed];
//# sourceMappingURL=queue.js.map