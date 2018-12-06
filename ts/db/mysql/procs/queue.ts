import {Procedure} from '../tool';

const readQueue:Procedure = {
    name: 'read_queue',
    params: [
        "_inOut tinyint", 
        "_moniker varchar(200)",
        "_queue bigint",
    ],
    label: '_exit',
    code:
`
    if _inOut=1 then
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
            from queue_in a join moniker b on a.moniker=b.id
            where b.moniker=_moniker and a.id>_queue
            limit 1;
    else
        select a.id as \`queue\`, b.moniker, a.body as \`data\`
        from queue_out a join moniker b on a.moniker=b.id
        where b.moniker=_moniker and a.id>_queue
        limit 1;
    end if;
`
}

const writeQueue:Procedure = {
    name: 'write_queue',
    params: [
        "_inOut tinyint", 
        "_moniker varchar(200)",
        "_body text"
    ],
    label: '_exit',
    code:
`
    declare _monikerId int;
    select a.id into _monikerId from moniker as a where a.moniker=_moniker;
    if _monikerId is null then
        insert into moniker (moniker) values (_moniker);
        set _monikerId=last_insert_id();
    end if;
    if _inOut=1 then
        insert into queue_in (moniker, body) values (_monikerId, _body);
    else
        insert into queue_out (moniker, body) values (_monikerId, _body);
    end if;
`
}

const readFaceProcessed:Procedure = {
    name: 'read_face_processed',
    params: [
        "_face varchar(200)",
    ],
    label: '_exit',
    code:
`
    select a.queue
        from face_processed a join moniker b on a.face=b.id
        where b.moniker=_face;
`
}

const writeFaceProcessed:Procedure = {
    name: 'write_face_processed',
    params: [
        "_face varchar(200)",
        "_queue BIGINT"
    ],
    label: '_exit',
    code:
`
    declare _faceId int;
    select a.id into _faceId from moniker as a where a.moniker=_face;
    insert into face_processed (face, queue)
        values (_faceId, _queue)
        on duplicate key update ex=0;
`
}

export default [readQueue, writeQueue, readFaceProcessed, writeFaceProcessed];
