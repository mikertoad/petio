import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Context } from 'koa';

import { authRequired } from '@/api/middleware/auth';
import personLookup from '@/tmdb/person';

// const cacheMiddleware = new ExpressCache(
//   cacheManager.caching({
//     store: "memory",
//     max: 100,
//     ttl: 86400, // Cache for 1 day
//   })
// );
const route = new Router({ prefix: '/person' });

export default (app: Router) => {
  route.get('/lookup/:id', lookupById);

  app.use(route.routes());
};

const lookupById = async (ctx: Context) => {
  let data = await personLookup(ctx.params.id);

  ctx.status = StatusCodes.OK;
  ctx.body = data;
};
