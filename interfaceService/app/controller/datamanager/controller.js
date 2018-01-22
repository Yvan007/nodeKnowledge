/**
 * Created by gy at 2017/12/6 下午1:00
 *
 * Desc :
 */
import { Industry_type,Channel_type,Industry_systerm,AdminUser,Project,BusinessModle,Channel_systerm,Character,CharacterMess,Character_case,RelationTables} from '../../modles'
import {MANAGER_LIMIT, NET, YAMLURL} from '../../config/config'
import {getSecond,isEmpty,isInArray,arrProduct} from '../../utils/importUtils'
import sequelize from '../../modles/db'
const fs = require('fs');
const koaSend = require('koa-send');
const archiver = require('archiver');
const moment = require('moment');


 /**
 * @api {post} /datamanager/list 体系列表(数据经理)
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_name": type_name ,"status": status,"page": page}' 'http://localhost:3000/datamanager/list'
 * @apiParam {String} type_name                  体系名称.
 * @apiParam {Integer} status                  体系状态.
 * @apiParam {Integer} page                     页码.
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
 * @apiSampleRequest /datamanager/list
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
    let obj ={to_user:currentUser.id};
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
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user} });
        value.dataValues.username = user.username;
    }
    ctx.body = NET.success({industryList,count})
}
 /**
 * @api {post} /datamanager/perfectIndustry 完善体系页面
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectIndustry
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id }' 'http://localhost:3000/datamanager/perfectIndustry'
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
 * @apiSampleRequest /datamanager/perfectIndustry
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "arrRes": {
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
export async function perfectIndustryView(ctx) {
    const industry_id = ctx.request.body.industry_id;
    if(!industry_id){
        ctx.body = {"code": 0,"msg": "参数错误"}
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
    ctx.body = NET.success({arrRes,industryTypeOne})
}
 /**
 * @api {post} /datamanager/industrySystermAdd 数据经理完善体系入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName industrySystermAdd
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{  }' 'http://localhost:3000/datamanager/industrySystermAdd'
 *
 *
 * @apiSampleRequest /datamanager/industrySystermAdd
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industrySystermData": {
                        "id": 1,
                        "pid": 0,
                        "sysname": "牙科",
                        "topid": 200001,
                        "create_time": 1509070456,
                        "create_user": 1,
                        "type_id": 1,
                        "user_type": 1,
                        "count_id": 100,
                        "is_parent": 1,
                        "update_time": 0
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
 export async function industrySystermCreate(ctx) {
    const currentUser = ctx.state.user;
    //const type_name = ctx.request.body.type_name;
    const desc = ctx.request.body.desc;
    if(!type_name || !desc){
        ctx.body = {"code": 0,"msg": "参数错误"}
        return
    }
    let obj = [{
        pid,
        sysname,
        create_time : getSecond(),
        create_user : currentUser.id,
        user_type : 0
    }]
    const industrySystermData = await Industry_systerm.bulkCreate(obj);
    ctx.body = { industrySystermData }
 }
 /**
 * @api {post} /datamanager/industryView 查看体系
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName industryView
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id }' 'http://localhost:3000/datamanager/industryView'
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
 * @apiSampleRequest /datamanager/industryView
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "arrRes": {
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
export async function industryViewList(ctx) {
    const industry_id = ctx.request.body.industry_id;
    if(!industry_id){
        ctx.body = {"code": 0,"msg": "参数错误"}
        return
    }
    //体系名称数据
    const industryTypeOne = await Industry_type.findOne({ where: { id: industry_id } });
    if(industryTypeOne.dataValues.to_user){
        const user = await AdminUser.findOne({ where: {id: industryTypeOne.dataValues.to_user},attributes:['id','username'] });
        industryTypeOne.dataValues.username = user.username;
    }
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
 * @api {post} /datamanager/projectList 项目列表(数据经理)
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName projectList
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "pro_name": pro_name ,"status": status,"page": page}' 'http://localhost:3000/datamanager/projectList'
 * @apiParam {String} pro_name                  项目名称.
 * @apiParam {Integer} status                   状态.
 * @apiParam {Integer} page                     页码.
 *
 * @apiSuccess {Object} projectList                    项目信息
 * @apiSuccess {String} projectList.username           创建人名字.
 * @apiSuccess {String} projectList.pro_name           项目名称.
 * @apiSuccess {String} projectList.desc               项目描述
 * @apiSuccess {Integer} projectList.create_time       创建时间
 * @apiSuccess {Integer} projectList.create_user       创建人
 * @apiSuccess {Integer} projectList.status            状态
 *
 * @apiSampleRequest /datamanager/projectList
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "projectList": {
                        "username": "创建人名字",
                        "pro_name": "牙科项目",
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
export async function projectList(ctx) {
    const pro_name = ctx.request.body.pro_name;
    const status = ctx.request.body.status;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;
    let obj ={status: [3,4]};
    if (pro_name) {
        obj.pro_name = {$like:'%'+pro_name+'%'};
    }
    if(status){
        obj.status = status;
    }
    if(page && page > 0) {
        page -= 1
    } else {
        page = 0
    }
    var count = await Project.count()
    const projectList = await Project.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(projectList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user} });
        value.dataValues.username = user.username;
    }
    ctx.body    = NET.success({projectList})
}
/**
 * @api {post} /datamanager/projectDetails 项目 分配选择特征库任务 （数据经理）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName projectDetails
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "project_id": project_id, "status": status }' 'http://localhost:3000/datamanager/projectDetails'
 * @apiParam {Integer} project_id                  项目ID.
 * @apiParam {Integer} status                  模式类型状态.
 *
 * @apiSuccess {Object} businessData                    业务模式信息
 * @apiSuccess {String} businessData.industry_info           体系ID和名称（json）.
 * @apiSuccess {Integer} businessData.create_time               创建时间
 * @apiSuccess {Integer} businessData.create_user       创建人
 * @apiSuccess {Integer} businessData.weight       分值
 * @apiSuccess {Integer} businessData.status            状态
 * @apiSuccess {Integer} businessData.to_user            分配人
 * @apiSuccess {Integer} businessData.project_id            项目ID

 * @apiSuccess {Object} industryTypeData                    体系信息
 * @apiSuccess {String} industryTypeData.type_name           体系名称.
 * @apiSuccess {String} industryTypeData.desc               体系描述
 * @apiSuccess {Integer} industryTypeData.create_time       创建时间
 * @apiSuccess {Integer} industryTypeData.create_user       创建人
 * @apiSuccess {Integer} industryTypeData.to_user            所属用户
 * @apiSuccess {Integer} industryTypeData.distribution_time            分配任务时间
 * @apiSuccess {Integer} industryTypeData.status            状态
 
 * @apiSuccess {Object} projectData                    项目信息
 * @apiSuccess {String} projectData.username           创建人名字.
 * @apiSuccess {String} projectData.pro_name           项目名称.
 * @apiSuccess {String} projectData.desc               项目描述
 * @apiSuccess {Integer} projectData.create_time       创建时间
 * @apiSuccess {Integer} projectData.create_user       创建人
 * @apiSuccess {Integer} projectData.status            状态
 *
 * @apiSampleRequest /datamanager/projectDetails
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "businessData": {
                        "industry_info": [{"industry_id":"33","industry_name":"\u773c\u79d1","count_id":"116"}],
                        "create_time": 1510557470,
                        "create_user": 1,
                        "weight": 80,
                        "status": 1,
                        "to_user": 0,
                        "project_id": 18
                    },
                    "industryTypeData": [
                    {
                        "id": 11,
                        "type_name": "33333",
                        "desc": "33333",
                        "create_time": 1512556381,
                        "create_user": 7,
                        "to_user": 0,
                        "distribution_time": 1512710462,
                        "status": 2
                    }],
                    "projectData": {
                        "id": 18,
                        "pro_name": "测试",
                        "desc": "dd",
                        "create_time": 1508922542,
                        "create_user": 1,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function projectDetails(ctx) {
    const project_id = ctx.request.body.project_id;
    const status = ctx.request.body.status;
    if(!project_id || !status){
        ctx.body = {"code": 0,"msg": "参数错误"}
        return
    }
    const industryTypeData = await Industry_type.getIndustryType();
    const projectData = await Project.getProject(project_id);
    const businessData = await BusinessModle.findOne({ where: { project_id: project_id, status: status } });
    ctx.body    = NET.success({businessData,industryTypeData,projectData})
}

/**
 * @api {post} /datamanager/choiceFeatureLibrary 选择特征库 （数据经理）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName choiceFeatureLibrary
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/datamanager/choiceFeatureLibrary'
 * @apiParam {Integer} business_id                  模式类型ID.
 * @apiParam {Integer} project_id                   项目ID.
 *
 * @apiSuccess {Object} businessData                    业务模式信息
 * @apiSuccess {Integer} businessData.id                模式id
 * @apiSuccess {Integer} businessData.weight            模式id
 * @apiSuccess {String} businessData.industry_info      体系ID和名称（json）.
 *
 * @apiSuccess {Object}  modleTypeObj                    体系类型数据
 * @apiSuccess {Integer} modleTypeObj.id                类型id
 * @apiSuccess {String} modleTypeObj.type_name           类型名称
 * @apiSuccess {Array}  modleTypeObj.child             当前模式下的类型子节点
 *
 * @apiSuccess {Object} channelData                    渠道信息
 * @apiSuccess {Integer} channelData.id                渠道id
 * @apiSuccess {String} channelData.type_name          渠道名称.

 * @apiSuccess {Integer} status                         业务模式状态
 * @apiSuccess {Integer} to_user                         分配人ID
 *
 *
 * @apiSampleRequest /datamanager/choiceFeatureLibrary
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *     {
    "code": 1,
    "msg": {
        "businessData": {
            "id": 40,
            "industry_info": [
                {
                    "industry_id": "58464",
                    "industry_name": "行业垂直网址",
                    "count_id": "1189",
                    "type_id": "11"
                },
                {
                    "industry_id": "58471",
                    "industry_name": "交流沟通",
                    "count_id": "1160",
                    "type_id": "11"
                },
                {
                    "industry_id": "58476",
                    "industry_name": "网络娱乐",
                    "count_id": "1161",
                    "type_id": "11"
                }
            ],
            "weight": 55
        },
        "modleTypeObj": {
            "11": {
                "child": [
                    "1189",
                    "1160",
                    "1161"
                ],
                "id": "11",
                "type_name": "行为识别"
            }
        },
        "channelData": [
            {
                "id": 42,
                "type_name": "sfdfs"
            },
        ],"characterData": [
            {
                "id": 1,
                "industry_ids": "11",
                "channel_ids": "5",
                "weight": 0,
                "create_time": 1509070456,
                "to_user": 0,
                "create_user": 1,
                "distribution_time": null,
                "industry_name": "33333",
                "channel_name": "行业职位渠道"
            }
        ]
    }
}

 *
 * @apiUse ERROR
 */
export async function choiceFeatureLibrary(ctx) {
    const business_id = ctx.request.body.business_id;
    const project_id = ctx.request.body.project_id;

    const status = ctx.request.body.status;
    const to_user = ctx.request.body.to_user;
    if(isEmpty(business_id) || isEmpty(project_id) || isEmpty(status)){
        ctx.body = NET.error("参数错误");
        return
    }
    //判断分配人是否是自己
    if(status==1){
        ctx.body = NET.error("当前模式未分配！");
        return
    }
    //session 用户ID
    const currentUser = ctx.state.user;
    if(to_user == currentUser.id){
        //获取当前模式数据
        const businessData = await BusinessModle.findOne({ where: { id: business_id },attributes:['id','industry_info',"weight"]});
        if(!businessData){
            ctx.body = NET.error("当前模式不存在");
            return;
        }
        //定义容器
        let  arrType=[],modleTypeObj={};
        //循环去重
        const modleInfo = JSON.parse(businessData.industry_info);
        for(let i in modleInfo){
            let objChild = {child:[]};
            const type_id = modleInfo[i].type_id;
            if(!isInArray(arrType,type_id)){
                arrType.push(type_id);
                objChild.id = type_id;
                const arrTypeInfo =  await Industry_type.findOne({where:{id:type_id,status:4},attributes:['id','type_name']});
                objChild.type_name = arrTypeInfo.type_name;
                objChild.child.push(modleInfo[i].count_id);
                modleTypeObj[type_id] = objChild;
            }else{
                modleTypeObj[type_id].child.push(modleInfo[i].count_id);
            }
        }
        businessData.industry_info = modleInfo;

        //特征库数据
        const relationTablesData = await RelationTables.findOne({ where : { business_id: business_id },attributes:['id','project_id','business_id','charact_id'] });
        if(relationTablesData){
            const charact_id = eval("("+relationTablesData.dataValues.charact_id+")");
            var characterData = await Character.findAll({ where: {id : charact_id},order : [['create_time', 'DESC']] });
            for (let value of Object.values(characterData)) {
                const industryData = await Industry_systerm.findOne({ where: {id: value.dataValues.industry_ids},attributes:['id','sysname'] });
                value.dataValues.industry_name = industryData.sysname;
                const channelData = await Channel_systerm.findOne({ where: {id: value.dataValues.channel_ids},attributes:['id','sysname'] });
                value.dataValues.channel_name = channelData.sysname;
            }
        }else{
            var characterData = [];
        }
        const channelData = await Channel_type.findAll({ order : [['create_time', 'DESC']],attributes:['id','type_name']});
        ctx.body    = NET.success({businessData,modleTypeObj,channelData,characterData,project_id})
    }else{
        ctx.body = NET.error("当前模式分配人不是自己！");
        return
    }
}
/**
 * @api {post} /datamanager/getIndustryBytype 获取体系树 （数据经理）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName getIndustryBytype
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_id": type_id,"child":{1,2,4}}'
 * 'http://localhost:3000/datamanager/getIndustryBytype'
 * @apiParam {Integer} type_id                  模式类型ID.
 * @apiParam {Object} child                     当前模式类型下的子节点
 *
 *
 *
 *
 * @apiSampleRequest /datamanager/getIndustryBytype
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 */

export async function getIndustryBytype(ctx){
    //接受参数
    const param = ctx.request.body;
    // console.log(param);
    // let param = { type_id: '1', child: [ '100', '116' ] };
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }

    const childArr = param.child;
    //定义容器
    var resArr = [];
    //根据节点id获取所有子节点（递归)
    for(let i in childArr){
        //先查询当前节点
        const arrIndustry = await Industry_systerm.findOne({where:{count_id:childArr[i]}});
        //attributes:[ ['count_id','id'],['sysname','name'],'pid','level','type_id','user_type','is_parent']
        let myArr=[arrIndustry.toJSON()];

        let childNode = await _getChildNode(arrIndustry.toJSON(),myArr);
        resArr.push(childNode);
    }

    ctx.body = NET.success(resArr);

}
/*
 ** 递归取体系节点
 */
async function _getChildNode(arrIndustry,myArr) {

    const arrChildNode = await Industry_systerm.findAll({ where: { pid: arrIndustry.count_id }});
    if(arrChildNode.length!=0){
        for (let value of Object.values(arrChildNode)) {
            //递归
            myArr.push(value.toJSON());
            await _getChildNode(value.toJSON(),myArr);
        }
        
    }

    return myArr;
}

/**
 * @api {post} /datamanager/createCase 生成实例
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName createCase
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_id": type_id,"child":{1,2,4}} 'http://localhost:3000/datamanager/createCase'
 * @apiParam {Integer}     project_id             项目id
 *
 *
 *
 *
 *
 * @apiSampleRequest /datamanager/createCase
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 */
var resNode = [];
export async function createCase(ctx){
    //接受参数
    const projectId = ctx.request.body.project_id;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //根据项目获取模式
    const modleInfo = await BusinessModle.findAll({where:{project_id:projectId}});
    //初始化 递归用的容器resNode
    resNode =[];
    if(!modleInfo.length!=0){
        ctx.body = NET.error("当前项目下无模式");
        return;
    }
    //定义容器
    var insertFiled =[];
    for(let value of Object.values(modleInfo)){
        const modelArr = JSON.parse(value.industry_info);
        var arrRes = [], finObj={};
        for(let i in modelArr){
            let industryArr = [];
            //获取当前节点下的所有终极子节点对应的特征库
            const arrFinalChild = await _getFinalNode(modelArr[i],industryArr);
            // const arrFinalChild = await _getChildList(modelArr[i]);
            Object.assign(finObj,arrFinalChild.resObj);

            if(arrFinalChild.myArr.length!=0) arrRes.push(arrFinalChild.myArr);
        }

        //判断是否所有节点下都存在终极子节点特征库
        if(modelArr.length!=arrRes.length){
            continue;
        }

        if(arrRes){
            //排列组合生成实例
            const caseInfo = await  _weiCase(arrRes);
            console.log(caseInfo);
            for(let cases of Object.values(caseInfo)){

                let fenzhi = 0;
                for(let char of Object.values(cases)){
                    fenzhi += finObj[char]*value.weight
                }
                //组合生成入数据
                const filedInfo ={
                    case_info:JSON.stringify(cases),
                    modle_id:value.id,
                    project_id:projectId,
                    fenzhi:fenzhi,

                };

                insertFiled.push(filedInfo);
            }
        }

    }


    if(insertFiled.length==0){
        ctx.body = NET.error("此项目下的模式无特征详单数据");
        return;
    }
    // console.log(insertFiled);
    //加表之前将表中数据删除
    const deleteRes = await Character_case.destroy({where:{project_id:projectId}});

    const insertRes = await Character_case.bulkCreate(insertFiled);
    if(!insertRes){
        ctx.body = NET.error("生成失败");
        return;
    }
    ctx.body = NET.success("生成成功");
}


/**
 * @api {post} /datamanager/selectCase c查看实例
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName selectCase
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_id": type_id,"child":{1,2,4}} 'http://localhost:3000/datamanager/selectCase'
 * @apiParam {Integer}     project_id             项目id
 *
 *
 *
 *
 *
 * @apiSampleRequest /datamanager/selectCase
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 */
//查看实例
export async function selectCase(ctx){
    //接受参数
    const projectId = ctx.request.body.project_id;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //let characterDatas = [];
    if(page && page > 0) {
        page -= 1
    } else {
        page = 0
    }
    var count = await Character_case.count({ where: { project_id: projectId} })
    //实例数据
    const characterCaseData = await Character_case.findAll({ where: { project_id: projectId },limit:[page * countLimit,countLimit] });
    for (let value of Object.values(characterCaseData)) {
        //特征库ID
        const charact_id = eval("("+value.dataValues.case_info+")");
        //特征库数据
        const characterData = await Character.findAll({ where: {id : charact_id},order : [['create_time', 'DESC']] });
        for (let values of Object.values(characterData)) {
            const industryData = await Industry_systerm.findOne({ where: {id: values.dataValues.industry_ids},attributes:['id','sysname'] });
            values.dataValues.industry_name = industryData.sysname;
            const channelData = await Channel_systerm.findOne({ where: {id: values.dataValues.channel_ids},attributes:['id','sysname'] });
            values.dataValues.channel_name = channelData.sysname;
            // characterDatas.push(values);
        }
        value.dataValues.case_infos = characterData;
    }
    ctx.body = NET.success({characterCaseData,count});
}





async function _getChildList(industry){
    //查询当前节点下的子节点
    const count_id = industry.count_id;
    //自定义函数取当前节点下的所有子节点
    const strCountId  = await sequelize.query('select getChildLst('+count_id+') as child',{ type: sequelize.QueryTypes.SELECT }).then(function(res){
        return res[0].child.replace(/^\,/,'');
    });
    const arrNodeInfo = await sequelize.query('select id as industry_id,count_id,sysname as industry_name from' +
        ' k_industry_systerm where `is_parent` = 0 and `count_id` in (' + strCountId+')',{ type: sequelize.QueryTypes.SELECT });
    var resObj = {};
    var myArr = [];
    for(let info of Object.values(arrNodeInfo)){
        //获取所有渠道

        const arrChannle = await Channel_systerm.findAll({attributes:['id']});

        for(let value of Object.values(arrChannle)){

            //查看此节点下有无特征库详单数据
            const chacacterInfo = await Character.findOne({where:{industry_ids:info.industry_id,channel_ids:value.id},attributes:['id','weight']});

            if(chacacterInfo){
                //查详单
                const detailInfo = await CharacterMess.findOne({where:{character_id:chacacterInfo.id},attributes:['id']});
                if(detailInfo){
                    // myArr.push({character_id:chacacterInfo.id,weight:chacacterInfo.weight});
                    resObj[chacacterInfo.id] = chacacterInfo.weight;
                    myArr.push(chacacterInfo.id);
                }
            }

        }
    }

    // console.log(arrNodeInfo);
    return {myArr,resObj};

}
//递归获取节点下的终极子节点
var  resObj={};
async function _getFinalNode(industry,myArr) {
    //查询当前节点下的子节点
    const arrChildNode  = await Industry_systerm.findAll({where:{pid:industry.count_id},attributes:[['id','industry_id'],'count_id',['sysname','industry_name']]});

    if(arrChildNode.length!=0){
        for(let value of Object.values(arrChildNode)){
            const nodeArr = value.toJSON();
            await _getFinalNode(nodeArr,myArr);
        }
    }else{
        //获取所有渠道

        const arrChannle = await Channel_systerm.findAll({attributes:['id']});

        for(let value of Object.values(arrChannle)){

            //查看此节点下有无特征库详单数据
            const chacacterInfo = await Character.findOne({where:{industry_ids:industry.industry_id,channel_ids:value.id},attributes:['id','weight']});

            if(chacacterInfo){
                //查详单
                const detailInfo = await CharacterMess.findOne({where:{character_id:chacacterInfo.id},attributes:['id']});
                if(detailInfo){
                    // myArr.push({character_id:chacacterInfo.id,weight:chacacterInfo.weight});
                    resObj[chacacterInfo.id] = chacacterInfo.weight;
                    myArr.push(chacacterInfo.id);
                }
            }

        }
        // myArr.push(industry.industry_id);

    }
    return {myArr,resObj};

}
//排列组合

function _weiCase(arrNode,arr=[]){

    if (arrNode.length == 0){
        resNode.push(arr);

    }else{
        for(let value of Object.values(arrNode[0])){
            //clone arr
            var ppArr = arr.slice(0);
            ppArr.push(value);
            //clone myNode
            var myNode = arrNode.slice(0);
            //删除第一个数组
            myNode.splice(0,1);
            _weiCase(myNode,ppArr);
        }
    }

    return resNode;
}

/**
 * @api {post} /datamanager/createYamlFile 生成配置文件 （数据经理）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName createYamlFile
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{project_id:project_id}'
 * 'http://localhost:3000/datamanager/createYamlFile'
 * @apiParam {Integer} project_id                  项目ID.
 *
 *
 * @apiSampleRequest /datamanager/createYamlFile
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 */
export async function createYamlFile(ctx){
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    // param.project_id = 107;
    //取出实例
    const caseInfo = await Character_case.findAll({where:{project_id:param.project_id}});
    if(caseInfo.length==0){
        ctx.body = NET.error("此项目下没有实例");
        return;
    }

    try{
        const obj = {keys:"关键字",url:"网址",modle:"模式融合",fenzhi:"分值"};
        var yamlPathInfo = createYamlPath(param.project_id,obj);
        //生成详单配置文件
        var box = [];
        for(let cases of Object.values(caseInfo)){
            const  arrCase = JSON.parse(cases.case_info);
            const stringCase1 = arrCase.join("|");
            const stringCase2 = arrCase.join("-");
            yamlPathInfo.modle.writeStream.write(stringCase1+":  "+stringCase2+"\n");
            yamlPathInfo.fenzhi.writeStream.write(stringCase2+":  "+cases.fenzhi+"\n");
            for(let value of Object.values(arrCase)){
                if(!isInArray(box,value)){
                    box.push(value);
                }
            }
        }
        //取出所有去重了之后的特征
        const charInfo  = await Character.findAll({where:{id:box},attributes:['id','industry_ids','channel_ids']});
        for(let chars of Object.values(charInfo)){
            const chnnleInfo = await Channel_systerm.findOne({where:{id:chars.channel_ids},attributes:['id','sysname']});
            //查询详单数据
            const messInfo = await CharacterMess.findAll({where:{character_id:chars.id}});
            switch (chnnleInfo.sysname){
                case "关键字":
                    for(let mess of Object.values(messInfo)){
                        yamlPathInfo.keys.writeStream.write("    "+mess.message+":  "+chars.id+"\n");
                    }
                    break;
                case "网址":

                    for(let mess of Object.values(messInfo)){
                        var my = mess.message;
                        if(my.includes("/")){
                            var content = my.substr(0,my.indexOf("/"));
                        }else{
                            var content = my
                        }
                        yamlPathInfo.url.writeStream.write(content+":\n");
                        yamlPathInfo.url.writeStream.write("    "+mess.message+":  "+chars.id+"\n");
                    }
                    break;
            }

        }
        //生成压缩文件
        // const proZipFile =createZipFile(yamlPathInfo);
        //关闭可写数据句柄
        closeStream(yamlPathInfo);
        //下载

        // ctx.set({
        //     'Content-Type': 'application/octet-stream',
        //     // 'Content-Type': 'application/x-msdownload',
        //     'Content-Disposition': 'attachment; filename=test.zip',
        // });
        // // var fileInfo = await readData('/private/var/www/knowlege/bigDataSystem/interfaceService/yaml/107/yamlZip.zip');
        //
        // var fReadStream = fs.createReadStream('/private/var/www/knowlege/bigDataSystem/interfaceService/yaml/107/yamlZip.zip');
        // fReadStream.on("data",(chunk) => ctx.body.write(chunk,"binary"));
        // fReadStream.on("end",function () {
        //     ctx.body.end();
        // });
        // ctx.body =fileInfo;
        // ctx.attachment('/yaml/107/fenzhi_2018-01-07.yaml');
        // await koaSend(ctx,'/yaml/107/fenzhi_2018-01-07.yaml');
        // await koaSend(ctx,proZipFile);
        var resArr =[];
        for(let path of Object.values(yamlPathInfo)){
            resArr.push(path.rootPath);
        }
        ctx.body = NET.success(resArr);
    }catch (err){
        console.log(err);
        ctx.body = NET.error("生成失败");
    }

}
/**
 * @api {post} /datamanager/exportYamlFile 导出配置文件 （数据经理）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName exportYamlFile
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{project_id:project_id}'
 * 'http://localhost:3000/datamanager/exportYamlFile'
 * @apiParam {Integer} yamlPath                  yaml 文件的路径.
 *
 *
 * @apiSampleRequest /datamanager/exportYamlFile
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 */
export async function exportYamlFile(ctx){
    const param = ctx.request.body;

    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const yamlPath=param.yamlPath;
    // const  yamlPath = "/yaml/107/modle_2018-01-07.yaml";
    ctx.attachment(yamlPath);
    await koaSend(ctx,yamlPath);
}
function  readData(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,function(err,data){
            if(err){
                reject(err);//文件存在返回true
            }else{
                resolve(data);//文件不存在，这里会抛出异常
            }
        });
    }).then(function(data){
        console.log(data);
        return data;
    },function(err){
        console.log(err);
        return err;
    });
}
// module .exports.readData =readData;
//创建路径信息
function createYamlPath(projectId,obj){
    //yaml 文件所在文件夹全路径
    const yamlPath = YAMLURL+projectId+"/";
    //创建容器
    var resultObj ={};
    //建立目录
    confirmPath(yamlPath);
    var time = moment().format("YYYY-MM-DD");
    for(let key of Object.keys(obj)){
        //文件名字
        const fileName = key+"_"+time+".yaml";
        //相对于根目录的路径
        const rootPath = "/yaml/"+projectId+"/"+fileName;
        const proPath = "/yaml/"+projectId+"/";
        //全路径
        const yamlFilePath = yamlPath+fileName;
        //创建可写文件句柄
        const writeStream =  fs.createWriteStream(yamlFilePath);
        if(key=="keys") writeStream.write("关键字:\n");
        const resObj = {fileName,rootPath,yamlFilePath,proPath,writeStream,yamlPath};
        resultObj[key] = resObj;
    }

    return resultObj;
}
//压缩打包yaml文件
function createZipFile(yamlPathInfo) {
    //压缩文件名字
    const zipFileName ="yamlZip.zip";
    const proZipFile =  yamlPathInfo.keys.proPath+zipFileName;
    var zipPath = yamlPathInfo.keys.yamlPath+zipFileName;
    //创建一最终打包文件的输出流
    var output = fs.createWriteStream(zipPath);
    //生成archiver对象，打包类型为zip
    var zipArchiver = archiver('zip');
    //将打包对象与输出流关联
    zipArchiver.pipe(output);
    for(let value of Object.values(yamlPathInfo)) {
        console.log(value.yamlFilePath);
        //将被打包文件的流添加进archiver对象中
        zipArchiver.append(fs.createReadStream(value.yamlFilePath),{name:value.fileName});
    }
    //打包
    zipArchiver.finalize();

    return proZipFile;
}
//关闭句柄
function closeStream(yamlPathInfo){
    for(let value of Object.values(yamlPathInfo)){
        value.writeStream.end();
    }
}
function confirmPath(pathStr){
    if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr);
        console.log('createPath: ' + pathStr);
    }
}

/**
 * @api {post} /datamanager/featureLibraryCreate 生成特征库
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName featureLibraryAdd
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ } 'http://localhost:3000/datamanager/featureLibraryCreate'
 * @apiParam {Integer}     industry_ids             体系ID
 * @apiParam {Integer}     channel_ids              渠道ID
 * @apiParam {Integer}     weight                   分值

 * @apiParam {Integer}     projectId                项目ID
 * @apiParam {Integer}     businessId              业务模式ID
 *
 *
 *
 *
 *
 * @apiSampleRequest /datamanager/featureLibraryCreate
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 * @apiUse SUCCESS
 */
 export async function featureLibraryAdd(ctx){
    const currentUser = ctx.state.user;
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //业务模式单条数据
    const businessData = await BusinessModle.findOne({ where : { id: param.businessId },attributes:['id','to_user'] });
    //判断分配人是否是自己
    if(businessData.dataValues.to_user==currentUser.id){
        var character = await Character.findOne({ where : { industry_ids: param.industry_ids,channel_ids: param.channel_ids },attributes:['id','industry_ids','channel_ids','weight','create_user'] });
        if(!character){
            //特征库入库
            var character = await Character.create({
                industry_ids: param.industry_ids,
                channel_ids: param.channel_ids,
                create_time : getSecond(),
                weight : param.weight,
                create_user : currentUser.id
            });
        }
        //体系节点名字
        const industrySystermName = await Industry_systerm.findOne({ where : { id: param.industry_ids },attributes:['id','sysname'] });
        character.dataValues.industrySystermName = industrySystermName.dataValues.sysname;
        //渠道节点名字
        const channelSystermName = await Channel_systerm.findOne({ where : { id: param.channel_ids },attributes:['id','sysname'] });
        character.dataValues.channelSystermName = channelSystermName.dataValues.sysname;
        if(character){
            //特征库和业务模式的关联数据
            const RelationTablesData = await RelationTables.findOne({ where : { business_id: param.businessId },attributes:['id','project_id','business_id','charact_id'] });
            if(RelationTablesData){
                const characterIds = JSON.parse(RelationTablesData.dataValues.charact_id);
                //判断当前特征库ID是否已经被引用
                if(characterIds.includes(character.dataValues.id)){
                    ctx.body = NET.error("当前特征已被该项目引用！");
                    return;
                }
                //加入新的特征库ID
                characterIds.push(character.dataValues.id)
                RelationTablesData.charact_id = JSON.stringify(characterIds);
                await RelationTablesData.save();
            }else{
                let characterIds = [];
                characterIds.push(character.dataValues.id);
                const relationTables = await RelationTables.create({
                    project_id: param.projectId,
                    business_id: param.businessId,
                    charact_id : JSON.stringify(characterIds)
                });
            }
            ctx.body = {"code":1 ,"msg": character}
        }else {
          ctx.body = NET.error("失败");
        }
    }else{
        ctx.body = NET.error("您非当前模式分配人！");
        return;
    }
 }
//删除特征库
export async function featureLibraryDel(ctx) {
    const characterId = ctx.request.body.characterId;
    if(isEmpty(characterId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const characterRes = await Character.destroy({ where : { id: characterId } });
    if(characterRes){
        ctx.body = NET.success("删除成功");
    }else {
      ctx.body = NET.error("删除失败");
    }
}
 /**
 * @api {post} /datamanager/featureLibrarySubmit 提交（选择特征库页面）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName featureLibrarySubmit
 * @apiGroup datamanager
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ } 'http://localhost:3000/datamanager/featureLibrarySubmit'
 * @apiParam {Integer}     projectId                项目ID
 * @apiParam {Integer}     businessId               业务模式ID
 *
 *
 *
 *
 *
 * @apiSampleRequest /datamanager/featureLibrarySubmit
 * @apiSuccessExample {json} Response 200 Example
 *     HTTP/1.1 200 OK
 *

 *
 * @apiUse ERROR
 * @apiUse SUCCESS
 */
 //选择特征库 单个提交
 export async function featureLibrarySubmit(ctx){
    const currentUser = ctx.state.user;
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const RelationTablesData = await RelationTables.findOne({ where : { business_id: param.businessId },attributes:['id','project_id','business_id','charact_id'] });
    if(!RelationTablesData){
        ctx.body = NET.error("请生成特征库在提交！");
        return;
    }
    const BusinessModles = await BusinessModle.findOne({ where : { id: param.businessId },attributes:['id','status','to_user'] });
    //判断分配人是否是自己
    if(BusinessModles&&BusinessModles.dataValues.to_user==currentUser.id){
        const projectData = await Project.findOne({ where : { id: param.projectId },attributes:['id','status'] });
        if(projectData&&projectData.dataValues.status==3){
            projectData.status = 4;
            await projectData.save();
            BusinessModles.status = 3;
            await BusinessModles.save();
            ctx.body    = NET.success({projectData,BusinessModles})
        }else {
          ctx.body = NET.error("非法提交！");
        }
    }else{
        ctx.body = NET.error("您与当前模式分配人不匹配！");
    }
 }
//业务模式总提交
export async function businessSubmission(ctx){
    //接受参数
    const projectId = ctx.request.body.projectId;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const projectData = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(projectData&&projectData.dataValues.status==4){
        projectData.status = 5;
        await projectData.save();
        ctx.body    = NET.success({projectData})
    }else {
        ctx.body = NET.error("非法提交！");
    }
 }