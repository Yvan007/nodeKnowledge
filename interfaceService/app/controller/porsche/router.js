/**
 * Created by zhaojinsheng at 2017/12/3 下午5:41
 *
 * Desc :
 */
import * as porsche from './controller'

export const baseUrl = '/porsche';


export default [
    {
        method: 'POST',
        route: '/getUserContent',
        handlers: [porsche.getUserContent]
    },
    {
        method: 'POST',
        route: '/getUserTpl',
        handlers: [porsche.getUserTpl]
    },
]