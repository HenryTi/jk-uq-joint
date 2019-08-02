import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import config from 'config';
//import { Joint } from './uq-joint';
import { settings } from './settings';
import { centerApi } from './uq-joint/tool/centerApi';
import { ProdJoint, TestJoint } from './uq-joint';

(async function () {
    console.log(process.env.NODE_ENV);
    
    let connection = config.get<any>("mysqlConn");
    if (connection === undefined || connection.host === '0.0.0.0') {
        console.log("mysql connection must defined in config/default.json or config/production.json");
        return;
    }
    let app = express();

    app.use((err:any, req:Request, res:Response, next:NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    app.use(bodyParser.json());
    app.use(cors());
    app.set('json replacer', (key:string, value:any) => {
        if (value === null) return undefined;
        return value;
    });

    app.use(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        let s= req.socket;
        let p = '';
        if (req.method !== 'GET') p = JSON.stringify(req.body);
        console.log('%s:%s - %s %s %s', s.remoteAddress, s.remotePort, req.method, req.originalUrl, p);
        try {
            await next();
        }
        catch (e) {
            console.error(e);
        }
    });

    //let joint = new Joint(settings);
    let joint = new ProdJoint(settings);
    //let joint = new TestJoint(settings);

    app.use('/joint-usq-jk', joint.createRouter());

    let port = config.get<number>('port');
    app.listen(port, async ()=>{
        let param = {
            $type: '$user',
            id: 2, 
            name: '1', 
            pwd: 'pwd', 
            nick: 'nick1-1',
            icon: 'icon1-1',
            country: 3, 
            mobile: 13901060561, 
            email: 'liaohengyi123@outlook.com', 
            wechat: 'wechat212',
        }
        param = {
            $type: '$user',
            country: undefined,
            email: 'lisa.sing@lonza.com',
            icon: null,
            id: null,
            mobile: null,
            name: "alfaaesar",
            nick: null,
            pwd: 'Li74j907',
            wechat: null
        }
        let ret = await centerApi.queueIn(param);

        console.log('UQ-API listening on port ' + port);
        let {host, user} = connection;
        console.log('process.env.NODE_ENV: %s\nDB host: %s, user: %s',
            process.env.NODE_ENV,
            host,
            user);
        await joint.start();
        //await startTimer();
    });
})();
