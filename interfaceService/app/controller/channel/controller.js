/**
 * Created by gy at 2017/12/6 下午1:00
 *
 * Desc :
 */
import { Channel_type } from '../../modles'
import { Channel_systerm } from '../../modles'
import { AdminUser } from '../../modles'

import passport from 'koa-passport';
import { MANAGER_LIMIT,NET } from '../../config/config'
import { getSecond,isEmpty } from '../../utils/importUtils'

 /**
 * @api {post} /channel/list 渠道列表
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_name": type_name ,"page": page}' 'http://localhost:3000/channel/list'
 * @apiParam {String} type_name                  渠道名称.
 * @apiParam {Integer} status                   状态.
 * @apiParam {Integer} page                     页码.
 *
 * @apiSuccess {Object} channelList                    渠道信息
 * @apiSuccess {String} channelList.username           创建人名字.
 * @apiSuccess {String} channelList.type_name           渠道名称.
 * @apiSuccess {String} channelList.desc               渠道描述
 * @apiSuccess {Integer} channelList.create_time       创建时间
 * @apiSuccess {Integer} channelList.create_user       创建人
 * @apiSuccess {Integer} channelList.status            状态
 *
 * @apiSampleRequest /channel/list
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "channelList": {
                        "username": "创建人名字",
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "status": 1
                    },
                "count": 8
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function channelList(ctx) {
    const status = ctx.request.body.status;
    const type_name = ctx.request.body.type_name;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;
    let obj ={};
    if (type_name) {
        obj.type_name = {$like:'%'+type_name+'%'};
    }
    if(status){
        obj.status = status;
    }
    if(page && page > 0) {
        page -= 1
    } else {
        page = 0
    }
    var count = await Channel_type.count()
    const channelList = await Channel_type.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(channelList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body = NET.success({channelList,count})
}
 /**
 * @api {post} /channel/add 添加渠道
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName add
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/channel/add'
 * @apiParam   {String} type_name                    渠道名称
 * @apiParam   {String} desc                        渠道描述
 *
 * @apiSuccess {Object} channelTypeData                    渠道信息
 * @apiSuccess {String} channelTypeData.type_name           渠道名称.
 * @apiSuccess {String} channelTypeData.desc               渠道描述
 * @apiSuccess {Integer} channelTypeData.create_time       创建时间
 * @apiSuccess {Integer} channelTypeData.create_user       创建人
 * @apiSuccess {Integer} channelTypeData.status            状态
 *
 * @apiSampleRequest /channel/add
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "channelTypeData": {
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function createChannelType(ctx) {
    const currentUser = ctx.state.user;
    const param = ctx.request.body;
    if(isEmpty(param.type_name)){
        ctx.body = NET.error("参数错误");
        return
    }
    const channelTypeOne = await Channel_type.findOne({ where: {type_name: param.type_name},attributes:['id','type_name'] });
    if(channelTypeOne){
        ctx.body = NET.error("渠道名称不可重复");
        return
    }
    const channelTypeData = await Channel_type.create({
        type_name: param.type_name,
        desc: param.desc,
        create_time : getSecond(),
        create_user : currentUser.id,
        to_user : 0,
        status : 1
    });
    // ctx.body = { channelTypeData }
   if(channelTypeData){
     ctx.body = {"code": 1,"msg": channelTypeData}
     return
   }else{
     ctx.body = NET.error("失败");
     return
   }
}
 /**
 * @api {post} /channel/save 修改渠道
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName save
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/channel/save'
 * @apiParam   {Integer} id                    id
 * @apiParam   {String} type_name                    type_name
 * @apiParam   {String} desc                    desc
 *
 * @apiSuccess {Object} Channel_type                    渠道信息
 * @apiSuccess {String} Channel_type.type_name           渠道名称.
 * @apiSuccess {String} Channel_type.desc               渠道描述
 * @apiSuccess {Integer} Channel_type.create_time       创建时间
 * @apiSuccess {Integer} Channel_type.create_user       创建人
 * @apiSuccess {Integer} Channel_type.status            状态
 *
 * @apiSampleRequest /channel/save
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "Channel_type": {
                        "type_name": "渠道渠道",
                        "desc": "这是一个很好的渠道渠道渠道渠道",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function updateChannelType(ctx) {
    const Channel_type = ctx.body.channelType;
    Channel_type.type_name = ctx.request.body.type_name;
    Channel_type.desc = ctx.request.body.desc;

    await Channel_type.save();
    ctx.body = { Channel_type }
}
 /**
 * @api {post} /channel/channelView 查看渠道
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName channelView
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "channel_id": channel_id }' 'http://localhost:3000/channel/channelView'
 * @apiParam   {Integer} channel_id                    channel_id
 *
 * @apiSuccess {Object} arrRes                    渠道信息
 * @apiSuccess {String} arrRes.type_name           渠道名称.
 * @apiSuccess {String} arrRes.desc               渠道描述
 * @apiSuccess {Integer} arrRes.create_time       创建时间
 * @apiSuccess {Integer} arrRes.create_user       创建人
 * @apiSuccess {Integer} arrRes.status            状态
 *
 * @apiSampleRequest /channel/channelView
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "arrRes": [
                        {
                            "id": 1,
                            "pid": 0,
                            "sysname": "数据渠道",
                            "topid": 100001,
                            "level": 0,
                            "create_user": 1,
                            "type_id": 1,
                            "count_id": 100,
                            "is_parent": 1
                        },
                        {
                            "id": 2,
                            "pid": 100,
                            "sysname": "运营商",
                            "topid": 200001,
                            "level": 1,
                            "create_user": 1,
                            "type_id": 1,
                            "count_id": 101,
                            "is_parent": 1
                        }
                    ],
                        "channelTypeOne": {
                            "id": 1,
                            "type_name": "电信"
                        }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function channelViewList(ctx) {
    const channel_id = ctx.request.body.channel_id;
    if(isEmpty(channel_id)){
        ctx.body = {"code": 0,"msg": "参数错误"}
        return
    }
    //渠道名称数据
    const channelTypeOne = await Channel_type.findOne({ where: { id: channel_id },attributes:['id','type_name','desc','status'] });
    //查询渠道数据
    const channelSystermData = await Channel_systerm.findAll({ where: { type_id: channel_id },attributes:['id','pid','sysname','topid','level','create_user','type_id','count_id','is_parent'] });
    if(!channelSystermData){
        ctx.body = NET.error("渠道库暂无数据");
        return;
    }
    let {keys,values,entries} = Object;
    let arrRes = [];
    for (let value of values(channelSystermData)) {
        arrRes.push(value);
    }
    ctx.body = NET.success({arrRes,channelTypeOne})
}
 /**
 * @api {post} /channel/perfectView 完善渠道页面
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectView
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "channel_id": channel_id }' 'http://localhost:3000/channel/perfectView'
 * @apiParam   {Integer} channel_id                    channel_id
 *
 * @apiSuccess {Object} channelTypeOne                    渠道信息
 * @apiSuccess {String} channelTypeOne.type_name           渠道名称.
 * @apiSuccess {String} channelTypeOne.desc               渠道描述
 * @apiSuccess {Integer} channelTypeOne.create_time       创建时间
 * @apiSuccess {Integer} channelTypeOne.create_user       创建人
 * @apiSuccess {Integer} channelTypeOne.status            状态
 *
 * @apiSampleRequest /channel/perfectView
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "channelTypeOne": {
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "status": 1
                    },
                    "count_id": 1132
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function perfectChannelView(ctx) {
    const channel_id = ctx.request.body.channel_id;
    if(isEmpty(channel_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    //渠道名称数据
    const channelTypeOne = await Channel_type.findOne({ where: { id: channel_id },attributes:['id','type_name','desc','create_user','status'] });
    const count_id = await Channel_systerm.max('count_id');
    if(!count_id){
        let count_id = 1000;
    }
    //查询渠道库数据
    const channelSystermData = await Channel_systerm.findAll({ where: { type_id: channel_id } });
    ctx.body = NET.success({channelTypeOne,channelSystermData,count_id})
}
/**
 * @api {post} /channel/channelCreat 渠道信息库 入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName channelCreat
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{  }' 'http://localhost:3000/channel/channelCreat'
 * @apiParam   {Object} channelData                    channelData
 * @apiParam   {Integer} channelId                    channelId

 * @apiSampleRequest /channel/channelCreat
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "characterMess": {
                        "id": 1,
                        "message": "11",
                        "character_id": "5"
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function channelAdd(ctx) {
    const currentUser = ctx.state.user;
    const channelId = ctx.request.body.channelId;
    const channelData = ctx.request.body.channelData;
    if(isEmpty(channelData)||isEmpty(channelId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const channelSystermRes = await Channel_systerm.destroy({ where : { type_id: channelId } });
    
        const count_id = await Channel_systerm.max('count_id');
        let {keys,values,entries} = Object;
        for (let value of values(channelData)) {
            value.count_id = parseInt(count_id)+parseInt(value.count_id);
            value.pid = value.pid==0?0:parseInt(value.pid)+parseInt(count_id);
            value.create_time = getSecond();
            value.create_user = currentUser.id;
        }
        const channelType = await Channel_type.findOne({ where : { id: channelId },attributes:['id','status'] });
        if(channelType.dataValues.status==2){
            ctx.body = NET.error("渠道信息库已完善，不可提交！");
            return;
        }
        const channelSystermData = await Channel_systerm.bulkCreate(channelData);
        if(channelType){
            channelType.status = 2;
            await channelType.save();
            ctx.body = NET.success(channelSystermData);
        }else {
          ctx.body = NET.error("失败");
        }
    
}
//暂存渠道库
export async function channelTemporaryAdd(ctx) {
    const currentUser = ctx.state.user;
    const channelId = ctx.request.body.channelId;
    const channelData = ctx.request.body.channelData;
    if(isEmpty(channelData)||isEmpty(channelId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const channelSystermRes = await Channel_systerm.destroy({ where : { type_id: channelId } });
    
        const count_id = await Channel_systerm.max('count_id');
        let {keys,values,entries} = Object;
        for (let value of values(channelData)) {
            value.count_id = parseInt(count_id)+parseInt(value.count_id);
            value.pid = value.pid==0?0:parseInt(value.pid)+parseInt(count_id);
            value.create_time = getSecond();
            value.create_user = currentUser.id;
        }
        const channelType = await Channel_type.findOne({ where : { id: channelId },attributes:['id','status'] });
        if(channelType.dataValues.status==2){
            ctx.body = NET.error("渠道信息库已完善，不可暂存！");
            return;
        }
        const channelSystermData = await Channel_systerm.bulkCreate(channelData);
        if(channelSystermData){
            ctx.body = NET.success(channelSystermData);
        }else {
          ctx.body = NET.error("失败");
        }
    
}

/**
 * @api {post} /channel/getChannelSysterm 获取渠道信息库接口
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName getChannelSysterm
 * @apiGroup channel
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{"typeId": typeId}' 'http://localhost:3000/channel/getChannelSysterm'
 * @apiParam   {Integer} typeId                    行业类型

 * @apiSuccess {Object} arrRes                    知识渠道信息
 * @apiSuccess {String} arrRes.id                  表中的主键id
 * @apiSuccess {Integer} arrRes.pid                父级ID
 * @apiSuccess {Integer} arrRes.count_id           记录层级结构的ID
 * @apiSuccess {String} arrRes.sysname             体系名称
 * @apiSuccess {Integer} arrRes.type_id          渠道名字ID
 * (不会返回已删除的banner 只作为服务器参考)
 *
 * @apiSampleRequest /channel/getChannelSysterm
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *    {
    "arrRes": [{
        "id": 1,
        "pid": 1,
        "count_id": 1,
        "sysname": "好项目好项目",
        "type_id": 1
    }]
}
 *
 * @apiUse ERROR
 */
export async function getChannelSysterm(ctx) {
    const typeId = ctx.request.body.typeId;
    if(isEmpty(typeId)){
        ctx.body = NET.error("参数错误");
        return
    }
    const channelSystermData = await Channel_systerm.findAll({ where: { type_id: typeId },attributes:['id','pid','count_id','sysname','type_id'] });
    if(!channelSystermData){
        ctx.body = NET.error("渠道库暂无数据");
        return;
    }
    let {keys,values,entries} = Object;
    let arrRes = [];
    for (let value of values(channelSystermData)) {
        arrRes.push(value);
    }
    ctx.body = { arrRes }
}





















export async function getChannelTypeData(ctx, next) {
    const id = ctx.request.body.id;
    if(isEmpty(id)){
        ctx.body = NET.error("参数错误");
        return
    }
    try {
        const channelType = await Channel_type.findOne({ where: { id: id } });
        if (!channelType) {
            ctx.throw(404)
        }
        ctx.body = { channelType }
    } catch (err) {
        if (err === 404 || err.name === 'CastError') {
            ctx.throw(404)
        }
        ctx.throw(500)
    }
    if (next) {
        return next()
    }
}