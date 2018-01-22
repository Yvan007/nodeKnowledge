import { verify } from 'jsonwebtoken'

import config from '../../config'
import { NET } from "../config/config";
import {AdminUser,LoginToken,adminRoles,rolePrivilege} from '../modles'
import {isInArray} from "../utils/importUtils";

export async function ensureUser(ctx, next) {
    const token = getToken(ctx);

    if (!token) {
        ctx.body = NET.ERROR.ERROR_NO_LOGIN;
        return;
    }
    //查看数据库中 是否有此token
    const tokenInfo = await LoginToken.findOne({where:{token:token}});
    let decoded = null;
    try {
        decoded = verify(token, config.token);
    } catch (err) {
        ctx.body = NET.ERROR.ERROR_NO_LOGIN;
        tokenInfo.status=2
        tokenInfo.save();
        return;
    }

    if(tokenInfo&&tokenInfo.status==2){
        ctx.body = NET.ERROR.ERROR_NO_LOGIN;
        return;
    }
    const userArr = await AdminUser.findById(decoded.id);
    let resUser =userArr.toJSON();
    delete resUser.password;
    ctx.state.user = resUser;

    if (!ctx.state.user) {
        ctx.body = NET.ERROR.ERROR_NO_LOGIN;
        return;
    }

    return next()
}
/*
 * 判断权限
 */
export async function ensurePermission(ctx, next) {
    //当前登录用户
    const role_id = ctx.state.user.role_id;
    // const role_id = 1;
    //查看当前角色拥有的权限
    const roleInfo = await adminRoles.findOne({where:{id:role_id},attributes:['id','pri_ids']});
    const arrPer = JSON.parse(roleInfo.pri_ids);
    //当前请求路由
    const currentUrl = ctx.request.url;
    //查询当前路由的id
    const urlInfo = await rolePrivilege.findOne({where:{role_url:currentUrl},attributes:['id']});
    if(!urlInfo||!isInArray(arrPer,urlInfo.id)){
        ctx.body = NET.ERROR.ERROR_NO_PRIVILEGE;
        return;
    }
    return next();



}
/**
 * 获取用户Token
 */
export function getToken(ctx) {
    const header = ctx.request.header.authorization

    if (!header) {
        return null
    }

    const parts = header.split(' ')
    if (parts.length !== 2) {
        return null
    }

    const scheme = parts[0]
    const token  = parts[1]

    if (/^Bearer$/i.test(scheme)) {
        return token
    }

    return null
}
export async function isLogin(ctx, next){
    if(ctx.isAuthenticated()){
        return next();
    }else{
        ctx.body = NET.ERROR.ERROR_NO_LOGIN;
        return;
    }
}