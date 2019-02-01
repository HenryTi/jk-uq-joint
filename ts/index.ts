import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import config from 'config';
import { Joint } from './usq-joint';
import { settings } from './settings';
import { host } from './usq-joint/tool/host';
import { centerApi } from './usq-joint/tool/centerApi';

(async function () {
    console.log(process.env.NODE_ENV);
    await host.start();
    centerApi.initBaseUrl(host.centerUrl);
    
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

    let joint = new Joint(settings);
    app.use('/joint-usq-jk', joint.createRouter());

    let port = config.get<number>('port');
    app.listen(port, async ()=>{
        console.log('USQL-API listening on port ' + port);
        let {host, user} = connection;
        console.log('process.env.NODE_ENV: %s\nDB host: %s, user: %s',
            process.env.NODE_ENV,
            host,
            user);
        joint.startTimer();
        //await startTimer();
    });
})();
