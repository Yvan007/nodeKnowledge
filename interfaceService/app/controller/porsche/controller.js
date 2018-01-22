/**
 * Created by zhaojinsheng at 2017/12/3 下午5:41
 *
 * Desc :
 */
import {isEmpty,isEmail,isPhone,getSecond} from '../../utils/importUtils';
/**
 * @api {post} /porsche/getUserTpl  获取用户站内信接口
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName getUserTpl
 * @apiGroup porsche
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "time": 1511766091564 }' 'http://localhost:3000/porsche/getUserTpl'
 * @apiParam {Date} time                   时间戳.
 *
 *
 * @apiSampleRequest /porsche/getUserTpl
 *
 *@apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
    "code": 0,
    "data": {
        {
            "id": 1,
            "user_id": "1",
            "station_mail_id": "1",
            "title": "好友点赞|强烈推荐",
            "content": "站内信| 内容 xxx ",
            "picture_path": "/backend/images/20160823/NORMAL/801e2463-a718-43a6-9cb4-4a95c70cb725@2x.jpg",
            "address": null,
            "recommend_time": 1466347189000,
        }
      }
     "msg":ok
  }
 *
 * @apiUse ERROR
 */
export async function  getUserTpl(ctx) {
    //接受参数
    const param = ctx.request.body;
    if(!param.time){
        ctx.body = {code:0,msg:"参数不能为空"};
        return;
    }
    const arrData = {
        id:1,
        user_id:1,
        station_mail_id:1,
        title:"好友点赞|强烈推荐",
        content:"站内信|内容××××",
        picture_path: "/backend/images/20160823/NORMAL/801e2463-a718-43a6-9cb4-4a95c70cb725@2x.jpg",
        address: null,
        recommend_time: 1466347189000,
    };
    ctx.body = {code:1,data:arrData,msg:"ok"};
}
/**
 * @api {post} /porsche/getUserContent 获取用户推送内容接口
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName getUserContent
 * @apiGroup porsche
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "time": 1466347189000}' 'http://localhost:3000/porsche/getUserContent'
 * @apiParam {Date} time                   时间戳.
 *
 *
 *
 * @apiSampleRequest /porsche/getUserContent
 *
 *@apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
    "code": 0,
    "data": {
        {
            "id": 1,
            "activity_id": "1",
            "user_id": "1",
            "actions": "browser",
            "recommend_time": 1511766091564,
            "position" : 1,
        }
      }
     "msg":ok
  }
 *
 * @apiUse ERROR
 */
export async function getUserContent(ctx){
    //接受参数
    const param = ctx.request.body;
    if(!param.time){
        ctx.body = {code:0,msg:"参数不能为空"};
        return;
    }
    const arrData = {
        id: 1,
        activity_id: "1",
        user_id: "1",
        actions: "browser",
        recommend_time: 1511766091564,
        position : 1,
    };
    ctx.body = {code:1,data:arrData,msg:"ok"};
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