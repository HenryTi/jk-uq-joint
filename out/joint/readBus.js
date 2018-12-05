"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIp_1 = require("./getIp");
async function readBus(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.write('<div>in ip ' + getIp_1.getIp(req) +
        ' out ip ' + getIp_1.getNetIp(req) +
        ' cliet ip ' + getIp_1.getClientIp(req) + '</div><br/><br/>');
    res.write('<h4>交换机: </h4>');
    res.write('<br/>');
    res.write('<br/>');
    res.write('<br/>');
    let data = '1\t2\ta38\n3\t2\t1543678133000\t\n\n\n';
    res.write(`<pre>
sample post:
[
    {face: "$$$/test/complex1", queue: 0, data: undefined},
    {face: "$$$/test/complex1", queue: undefined, data: ${JSON.stringify(data)}}
]

sample data:
${data}

sample bus:
{
    "schema1": [
        {"name": "a1", "type": "string"},
        {"name": "a2", "type": "number"},
        {"name": "a3", "type": "date"},
        {"name": "a4", "type": "id"},
    ],
    "schema2": [
        {"name": "a3", "type": "string"},
        {"name": "cb2", "type": "number"},
        {"name": "aa3", "type": "date"}
    ],
    "complex1": [
        {"name": "a1", "type": "string"},
        {"name": "c3", "type": "string"},
        {"name": "bbba37", "type": "string"},
        {"name": "arrName", "fields": "schema1"}
    ]
}
</pre>`);
    // res.write('<form action="./'+ name + '" method="post"><button type="submit">submit</button></form>');
    res.end();
}
exports.readBus = readBus;
//# sourceMappingURL=readBus.js.map