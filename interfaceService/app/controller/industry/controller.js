/**
 * Created by gy at 2017/12/6 下午1:00
 *
 * Desc :
 */
import { Industry_type } from '../../modles'
import { Industry_systerm } from '../../modles'
import { AdminUser } from '../../modles'

import passport from 'koa-passport';
import { MANAGER_LIMIT,NET } from '../../config/config'
import { getSecond,isEmpty } from '../../utils/importUtils'

 /**
 * @api {post} /industry/list 体系列表
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_name": type_name ,"page": page}' 'http://localhost:3000/industry/list'
 * @apiParam {String} type_name                  体系名称.
 * @apiParam {Integer} page                     页码.
 * @apiParam {Integer} status                   状态.
 *
 * @apiSuccess {Object} industryList                    体系信息
 * @apiSuccess {String} industryList.username           创建人名字.
 * @apiSuccess {String} industryList.type_name           体系名称.
 * @apiSuccess {String} industryList.desc               体系描述
 * @apiSuccess {Integer} industryList.create_time       创建时间
 * @apiSuccess {Integer} industryList.create_user       创建人
 * @apiSuccess {Integer} industryList.to_user            所属用户
 * @apiSuccess {Integer} industryList.status            状态
 *
 * @apiSampleRequest /industry/list
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryList": {
                        "username": "创建人名字",
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "to_user": 1,
                        "status": 1
                    },
                "count": 8
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function industryList(ctx) {
    const type_name = ctx.request.body.type_name;
    const status = ctx.request.body.status;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;
    const currentUser = ctx.state.user;

    //判断不同角色取出不同的项目列表
    if(currentUser.role_id==1){
        //超级管理员
        var obj ={};
    }else if(currentUser.role_id==2){
        //行业专家
        var obj ={};
    }else if(currentUser.role_id==3){
        //数据管理员
        var obj ={status: [2,3,4]};
    }else if(currentUser.role_id==4){
        //数据专员
        var obj ={status: [0]};
    }else if(currentUser.role_id==5){
        //数据经理
        var obj = {'$or':{status: 4,to_user: currentUser.id}};
    }



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
    var count = await Industry_type.count({where: obj})
    const industryList = await Industry_type.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(industryList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body = NET.success({industryList,count})
}
 /**
 * @api {post} /industry/add 添加体系
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName add
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/industry/add'
 * @apiParam   {String} type_name                    体系名称
 * @apiParam   {String} desc                        体系描述
 *
 * @apiSuccess {Object} industryTypeData                    体系信息
 * @apiSuccess {String} industryTypeData.type_name           体系名称.
 * @apiSuccess {String} industryTypeData.desc               体系描述
 * @apiSuccess {Integer} industryTypeData.create_time       创建时间
 * @apiSuccess {Integer} industryTypeData.create_user       创建人
 * @apiSuccess {Integer} industryTypeData.to_user            所属用户
 * @apiSuccess {Integer} industryTypeData.status            状态
 *
 * @apiSampleRequest /industry/add
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryTypeData": {
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "to_user": 1,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function createIndustryType(ctx) {
    const currentUser = ctx.state.user;
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param.type_name)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const industryTypeOne = await Industry_type.findOne({ where: {type_name: param.type_name},attributes:['id','type_name'] });
    if(industryTypeOne){
        ctx.body = NET.error("体系名称不可重复");
        return
    }
    let obj = [{
        type_name: param.type_name,
        desc: param.desc,
        create_time : getSecond(),
        create_user : currentUser.id,
        to_user : 0,
        status : 1
    }]
    const industryTypeData = await Industry_type.bulkCreate(obj);
    if(industryTypeData){
        ctx.body = {"code": 1,"msg": industryTypeData}
        return
    }else{
        ctx.body = NET.error("失败");
        return
    }
    //ctx.body = { industryTypeData }
}
 /**
 * @api {post} /industry/save 修改体系
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName save
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/industry/save'
 * @apiParam   {Integer} id                    id
 * @apiParam   {String} type_name               type_name
 * @apiParam   {String} desc                    desc
 *
 * @apiSuccess {Object} industryType                    体系信息
 * @apiSuccess {String} industryType.type_name           体系名称.
 * @apiSuccess {String} industryType.desc               体系描述
 * @apiSuccess {Integer} industryType.create_time       创建时间
 * @apiSuccess {Integer} industryType.create_user       创建人
 * @apiSuccess {Integer} industryType.to_user            所属用户
 * @apiSuccess {Integer} industryType.status            状态
 *
 * @apiSampleRequest /industry/save
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryType": {
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "to_user": 1,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function updateIndustryType(ctx) {
    const Industry_type = ctx.body.industryType;
    Industry_type.type_name = ctx.request.body.type_name;
    Industry_type.desc = ctx.request.body.desc;

    await Industry_type.save();
    ctx.body = { Industry_type }
}
 /**
 * @api {post} /industry/industryView 查看体系
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName industryView
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id }' 'http://localhost:3000/industry/industryView'
 * @apiParam   {Integer} industry_id                    industry_id
 *
 * @apiSuccess {Object} arrRes                    体系信息
 * @apiSuccess {String} arrRes.type_name           体系名称.
 * @apiSuccess {String} arrRes.desc               体系描述
 * @apiSuccess {Integer} arrRes.create_time       创建时间
 * @apiSuccess {Integer} arrRes.create_user       创建人
 * @apiSuccess {Integer} arrRes.to_user            所属用户
 * @apiSuccess {Integer} arrRes.status            状态
 *
 * @apiSampleRequest /industry/industryView
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
                            "sysname": "牙科",
                            "topid": 200001,
                            "level": 0,
                            "create_time": 1509070456,
                            "create_user": 1,
                            "type_id": 1,
                            "user_type": 1,
                            "count_id": 100,
                            "is_parent": 1,
                            "update_time": 0
                        },
                        {
                            "id": 2,
                            "pid": 100,
                            "sysname": "语义识别",
                            "topid": 300001,
                            "level": 1,
                            "create_time": 1509070456,
                            "create_user": 1,
                            "type_id": 1,
                            "user_type": 2,
                            "count_id": 101,
                            "is_parent": 1,
                            "update_time": 0
                        }
                    ],
                    "industryTypeOne": {
                        "id": 1,
                        "type_name": "医疗"
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function industryViewList(ctx) {
    const industry_id = ctx.request.body.industry_id;
    if(isEmpty(industry_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    //体系名称数据
    const industryTypeOne = await Industry_type.findOne({ where: { id: industry_id },attributes:['id','type_name','desc','status'] });
    //查询体系数据
    const industrySystermData = await Industry_systerm.findAll({ where: { type_id: industry_id } });

    let {keys,values,entries} = Object;
    let arrRes = [];
    for (let value of values(industrySystermData)) {
        arrRes.push(value);
    }
    ctx.body = NET.success({arrRes,industryTypeOne})
}
 /**
 * @api {post} /industry/perfectView 完善体系页面
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectView
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id }' 'http://localhost:3000/industry/perfectView'
 * @apiParam   {Integer} industry_id                    industry_id
 *
 * @apiSuccess {Object} industryTypeOne                    体系信息
 * @apiSuccess {String} industryTypeOne.type_name           体系名称.
 * @apiSuccess {String} industryTypeOne.desc               体系描述
 * @apiSuccess {Integer} industryTypeOne.create_time       创建时间
 * @apiSuccess {Integer} industryTypeOne.create_user       创建人
 * @apiSuccess {Integer} industryTypeOne.to_user            所属用户
 * @apiSuccess {Integer} industryTypeOne.status            状态
 *
 * @apiSampleRequest /industry/perfectView
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryTypeOne": {
                        "type_name": "牙科项目",
                        "desc": "这是一个很好的项目",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "to_user": 1,
                        "status": 1
                    },
                    "count_id": 1132
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function perfectIndustryView(ctx) {
    const industry_id = ctx.request.body.industry_id;
    if(isEmpty(industry_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    //体系名称数据
    const industryTypeOne = await Industry_type.findOne({ where: { id: industry_id } });
    //查询体系数据
    const industrySystermData = await Industry_systerm.findAll({ where: { type_id: industry_id } });
    let {keys,values,entries} = Object;
    let arrRes = [];
    for (let value of values(industrySystermData)) {
        arrRes.push(value);
    }
    // const count_id = await Industry_systerm.max('count_id');
    // if(!count_id){
    //     let count_id = 1000;
    // }
    ctx.body = NET.success({industryTypeOne,arrRes})
}
/**
 * @api {post} /industry/industryCreat 体系信息库 入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName industryCreat
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{  }' 'http://localhost:3000/industry/industryCreat'
 * @apiParam   {Object} industryData                    industryData
 * @apiParam   {Integer} industryId                    industryId
 * @apiSampleRequest /industry/industryCreat
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "industrySystermData":  [
                        {
                            sysname: '新子节点1241',
                            pid: '1240,
                            count_id: 1241,
                            is_parent: 1,
                            level: 3,
                            type_id: 27
                        }
                    ]
                }
            }
 *     }
 *
 * @apiUse SUCCESS
 * @apiUse ERROR
 */
export async function industryAdd(ctx) {
    const currentUser = ctx.state.user;
    const industryId = ctx.request.body.industryId;
    const industryData = ctx.request.body.industryData;
    if(isEmpty(industryData)||isEmpty(industryId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const IndustryType = await Industry_type.findOne({ where : { id: industryId },attributes:['id','status','to_user'] });
    if(IndustryType.dataValues.to_user==currentUser.id || currentUser.role_id==2){
        //删除之前的节点
        const industrySystermRes = await Industry_systerm.destroy({ where : { type_id: industryId } });
        //体系节点入库
        const count_id = await Industry_systerm.max('count_id');
        let {keys,values,entries} = Object;
        for (let value of values(industryData)) {
            value.count_id = parseInt(count_id)+parseInt(value.count_id);
            value.pid = value.pid==0?0:parseInt(value.pid)+parseInt(count_id);
            value.create_time = getSecond();
            value.create_user = currentUser.id;
        }
        if(IndustryType.dataValues.status==4){
            ctx.body = NET.error("体系信息库已完善，不可提交！");
            return;
        }
        const industrySystermData = await Industry_systerm.bulkCreate(industryData);
        if(industrySystermData){
            if(currentUser.role_id==5){
                IndustryType.status = 4;
            }else if(currentUser.role_id==2){
                IndustryType.status = 2;
            }
            await IndustryType.save();
            ctx.body = NET.success(industrySystermData);
        }else {
          ctx.body = NET.error("失败");
        }
    }else{
        ctx.body = NET.error("您无权限！");
        return;
    }
}
//暂存体系库
export async function industryTemporaryAdd(ctx) {
    const currentUser = ctx.state.user;
    const industryId = ctx.request.body.industryId;
    const industryData = ctx.request.body.industryData;
    if(isEmpty(industryData)||isEmpty(industryId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const IndustryType = await Industry_type.findOne({ where : { id: industryId },attributes:['id','status','to_user'] });
    if(IndustryType.dataValues.to_user==currentUser.id || currentUser.role_id==2){
        //删除之前的节点
        const industrySystermRes = await Industry_systerm.destroy({ where : { type_id: industryId } });
        //体系节点入库
        const count_id = await Industry_systerm.max('count_id');
        let {keys,values,entries} = Object;
        for (let value of values(industryData)) {
            value.count_id = parseInt(count_id)+parseInt(value.count_id);
            value.pid = value.pid==0?0:parseInt(value.pid)+parseInt(count_id);
            value.create_time = getSecond();
            value.create_user = currentUser.id;
        }
        if(IndustryType.dataValues.status==4){
            ctx.body = NET.error("体系信息库已完善，不可暂存！");
            return;
        }
        const industrySystermData = await Industry_systerm.bulkCreate(industryData);
        if(industrySystermData){
            ctx.body = NET.success(industrySystermData);
        }else {
          ctx.body = NET.error("失败");
        }
    }else{
        ctx.body = NET.error("您无权限！");
        return;
    }
}
/**
 * @api {post} /industry/systermSave 修改节点
 * @apiPermission 管理后台
 * @apiVersion 1.0.0 
 * @apiName industrySystermSave
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/industry/systermSave'
 * @apiParam   {Integer} industrySysterId                   节点id
 * @apiParam   {String} sysname                   节点名字
 
 * @apiSampleRequest /industry/systermSave
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *  {
    success: true
}
 *
 * @apiUse ERROR
 */
export async function industrySystermSave(ctx) {
    //验证参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const IndustrySysterm = await Industry_systerm.findOne({ where : { id: param.industrySysterId },attributes:['id','sysname'] });
    IndustrySysterm.sysname = param.sysname;
    const industrySystermRes = await IndustrySysterm.save();
    if(industrySystermRes){
        ctx.body = {"code": 1,"msg": industrySystermRes}
    }else {
      ctx.body = NET.error("修改失败");
    }
}
/**
 * @api {post} /industry/delete 删除节点
 * @apiPermission 管理后台
 * @apiVersion 1.0.0 
 * @apiName industrySystermDel
 * @apiGroup industry
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/industry/delete'
 * @apiParam   {Integer} industrySysterId                   节点id
 
 * @apiSampleRequest /industry/delete
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *  {
    success: true
}
 *
 * @apiUse ERROR
 */
export async function industrySystermDel(ctx) {
    const industrySysterId = ctx.request.body.industrySysterId;
    if(isEmpty(industrySysterId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const industrySystermRes = await Industry_systerm.destroy({ where : { id: industrySysterId } });
    if(industrySystermRes){
        ctx.body = NET.success("删除成功");
    }else {
      ctx.body = NET.error("删除失败");
    }
}

















export async function getIndustryTypeData(ctx, next) {
    const id = ctx.request.body.id;
    if(isEmpty(id)){
        ctx.body = NET.error("参数错误");
        return
    }
    try {
        const industryType = await Industry_type.findOne({ where: { id: id } });
        if (!industryType) {
            ctx.throw(404)
        }
        ctx.body = { industryType }
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