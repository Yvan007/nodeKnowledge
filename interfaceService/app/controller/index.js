import glob from 'glob';
import { ensureUser,ensurePermission } from  "../auth/validators";
import Router from 'koa-router';
import {isInArray} from "../utils/importUtils";
import {NOCHECKURL} from "../config/config";
//挂载路由
exports = module.exports = function initModules(app) {
    glob(`${__dirname}/*/`, (err, matches) => {
        if (err) {
            throw err
        }

        matches.forEach((mod) => {
            const router = require(`${mod}/router`);

            const routes = router.default;
            const baseUrl = router.baseUrl;
            //设置路由前缀
            const instance = new Router({ prefix: baseUrl });

            routes.forEach((obj) => {

                const { method = '', route = '', handlers = [] } = obj;
                const lastHandler = handlers.pop(); //删除并返回数组的最后一个元素
                //设置忽略的路由
                if(!isInArray(NOCHECKURL,route)){
                    handlers.unshift(ensurePermission);
                    handlers.unshift(ensureUser);
                }

                instance[method.toLowerCase()](route, ...handlers, async function(ctx) {
                    return await lastHandler(ctx);
                });

                app.use(instance.routes()).use(instance.allowedMethods());
            })
        })
    })
}