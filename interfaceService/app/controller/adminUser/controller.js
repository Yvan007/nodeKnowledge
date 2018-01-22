/**
 * Created by zhaojinsheng at 2017/12/3 下午5:41
 *
 * Desc :
 */
import {AdminUser,LoginToken} from '../../modles';
import {isEmpty,isEmail,isPhone,getSecond,getClientIp} from '../../utils/importUtils';
import {NET} from "../../config/config";
import {getToken} from "../../auth/validators";
/**
 * @api {post} /adminUser/login 登陆
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName login
 * @apiGroup adminUser
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": username ,"password": password }' 'http://localhost:3000/adminUser/login'
 * @apiParam {String} username                   用户名.
 * @apiParam {String} password                   密码.
 *
 * @apiSampleRequest /adminUser/login
 *
 * @apiUse SUCCESS
 *
 * @apiUse ERROR
 */
export async function  userLogin(ctx) {
    //验证参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数不能为空");
        return;
    }
    //查看有无此人
    const admin = await AdminUser.findOne({ where: { 'username': param.username } });
    if(!admin){
        ctx.body = NET.error("无当前用户");
        return;
    }
    const isMatch = await admin.validatePassword(param.password);
    if (!isMatch) {
        ctx.body = NET.error("密码不正确");
        return;
    }
    //生成token
    const token = admin.generateToken();
    const response = admin.toJSON();
    response.token = token;
    //查看数据库中 是否有此token
    const tokenInfo = await LoginToken.findOne({where:{token:token}});
    if(tokenInfo){
        tokenInfo.status = 1;
        await tokenInfo.save();
    }else{
        await LoginToken.create({
            token:token
        });
    }
    delete response.password;
    ctx.body = NET.success(response);
    // return passport.authenticate('local', async (user) => {
    //
    //     if (!user) {
    //         ctx.throw(401)
    //     }
    //     if (user.code != 1) {
    //         ctx.body = user;
    //         return;
    //     }
    //
    //     const token = user.msg.generateToken();
    //     const response = user.msg.toJSON();
    //     response.token = token;
    //
    //     return ctx.login(user.msg);
    // })(ctx, next);
}

/**
 * @api {post} /adminUser/loginOut 注销登陆
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName loginOut
 * @apiGroup adminUser
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ }' 'http://localhost:3000/adminUser/loginOut'
 *
 *
 * @apiSampleRequest /adminUser/loginOut
 *
 * @apiUse SUCCESS
 *
 * @apiUse ERROR
 */
export async function loginOut(ctx){
    //获取token
    const token = getToken(ctx);
    const tokenInfo = await LoginToken.findOne({where:{token:token}});
    if(!tokenInfo){
        ctx.body = NET.error("注销失败");
        return;
    }
    tokenInfo.status=2;
    const upRes = await tokenInfo.save();
    if(!upRes){
        ctx.body = NET.error("注销失败");
        return;
    }
    ctx.body = NET.success("注销成功");

}
/**
 * @api {post} /adminUser/createUser 添加用户
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName createUser
 * @apiGroup adminUser
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": username ,"password": password ,"sex":sex,"role_id":role_id,"email":email,"mobile":mobile}' 'http://localhost:3000/adminUser/login'
 * @apiParam {String} username                   用户名.
 * @apiParam {String} password                   密码.
 * @apiParam {Integer} sex                       性别.
 * @apiParam {Integer} role_id                   角色id.
 * @apiParam {String}  email                     邮箱.
 * @apiParam {String}  mobile                    手机.
 *
 *
 * @apiSampleRequest /adminUser/createUser
 *
 * @apiUse SUCCESS
 *
 * @apiUse ERROR
 */
export async function createUser(ctx){
    //接受参数

    const param = ctx.request.body;

    if(isEmpty(param)){
        ctx.body = NET.error("参数不能为空");
        return;
    }
    if(!isPhone(param.mobile)){
        ctx.body = NET.error("手机号不正确");
        return;
    }
    if(!isEmail(param.email)){
        ctx.body = NET.error("邮箱不正确");
        return;
    }

    const emailInfo = await AdminUser.getUserByEmail(param.email);
    if(emailInfo.length!=0){
        ctx.body = NET.error("该邮箱已经被注册");
        return;
    }
    const mobileInfo = await await AdminUser.getUserByMobile(param.mobile);
    if(mobileInfo.length!=0){
        ctx.body = NET.error("该手机已经被注册");
        return;
    }
    //查看用户是否已经存在
    const userInfo = await AdminUser.getUserByUserName(param.username);
    if(userInfo.length!=0){
        ctx.body = NET.error("此用户已经存在");
        return;
    }
    const currentUser = ctx.state.user;

    const adminUser = await AdminUser.create({
        'username':param.username,
        'password':param.password,
        'sex':param.sex,
        'role_id':param.role_id,
        'email' : param.email,
        'mobile':param.mobile,
        'reg_time':getSecond(),
        'reg_ip':getClientIp(ctx),
        'reg_user':currentUser.id
    });
    if(!adminUser){
        ctx.body = NET.error("创建失败");
        return;
    }
    delete adminUser.password;
    ctx.body = NET.success("创建成功");

}

/**
 * @apiDefine ERROR
 * @apiErrorExample {json} 错误返回:
 *     {
 *       "code": 0,
 *       "msg":"错误信息"
 *     }
 */

/**
 * @apiDefine SUCCESS
 * @apiSuccessExample {json} 成功返回:
 *     {
 *       "code": 1,
 *       "msg":"成功信息"
 *     }
 */