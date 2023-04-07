import fs from 'fs';
import path from 'path';
import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Context } from 'koa';

import { adminRequired } from '@/api/middleware/auth';
import pathsConfig from "@/config/env/paths";

const liveLogfile = path.join(pathsConfig.dataDir, './logs/live1.log');
const liveLogfile2 = path.join(pathsConfig.dataDir, './logs/live.log');

const streamLog = async (ctx: Context) => {
  let dataNew; let dataOld;
  try {
    const logsNew = fs.readFileSync(liveLogfile, 'utf8');
    dataNew = JSON.parse(`[${logsNew.replace(/,\s*$/, '')}]`);
  } catch {
    dataNew = [];
  }

  try {
    const logsOld = fs.readFileSync(liveLogfile2, 'utf8');
    dataOld = JSON.parse(`[${logsOld.replace(/,\s*$/, '')}]`);
  } catch {
    dataOld = [];
  }

  const data = [...dataNew, ...dataOld];

  ctx.status = StatusCodes.OK;
  ctx.body = data;
};

const route = new Router({ prefix: '/logs' });
export default (app: Router) => {
  route.get('/stream', adminRequired, streamLog);

  app.use(route.routes());
};
