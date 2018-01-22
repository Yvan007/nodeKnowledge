/**
 * Created by zhaojinsheng at 2017/12/1 下午1:01
 *
 * Desc :
 */
/**
 * 错误处理中间件
 */
export function errorMiddleware() {
    return async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            console.info('catch exception', err);
            ctx.body   = err.message;
            ctx.status = err.status || 500;
            ctx.app.emit('error', err, ctx);
        }
    }
}