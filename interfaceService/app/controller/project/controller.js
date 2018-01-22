/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import { Project } from '../../modles'
import { Industry_type } from '../../modles'
import { BusinessModle } from '../../modles'
import { Industry_systerm } from '../../modles'
import { AdminUser } from '../../modles'
import { Channel_systerm } from '../../modles'

import { Character } from '../../modles'
import { CharacterMess } from '../../modles'
import { RelationTables } from '../../modles'
import { Channel_type } from '../../modles'


import passport from 'koa-passport';
import { MANAGER_LIMIT,NET } from '../../config/config'
import { getSecond,isEmpty } from '../../utils/importUtils'

 /**
 * @api {post} /project/list 项目列表
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "pro_name": pro_name ,"status": status,"page": page}' 'http://localhost:3000/project/list'
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
 * @apiSampleRequest /project/list
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
                    },
                "count": 8
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function projectList(ctx) {
    //参数
    const currentUser = ctx.state.user;
    const pro_name = ctx.request.body.pro_name;
    const status = ctx.request.body.status;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;

    //判断不同角色取出不同的项目列表
    if(currentUser.role_id==1){
        //超级管理员
        var obj ={};
    }else if(currentUser.role_id==2){
        //行业专家
        var obj ={};
    }else if(currentUser.role_id==3){
        //数据管理员
        var obj ={status: [2,3,4,5,6,7,8]};
    }else if(currentUser.role_id==4){
        //数据专员
        var obj ={status: [6,7,8]};
    }else if(currentUser.role_id==5){
        //数据经理
        var obj ={status: [3,4,5,6,7,8]};
    }
    //搜索条件
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
    var count = await Project.count({ where:obj })
    const projectList = await Project.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(projectList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body    = NET.success({projectList,count})
}
/**
 * @api {post} /project/add 新增项目
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName createProject
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/project/add'
 * @apiParam   {String} pro_name                    项目名称
 * @apiParam   {String} desc                        项目描述

 * @apiSuccess {Object} project                    项目信息
 * @apiSuccess {String} project.pro_name           项目名称.
 * @apiSuccess {String} project.desc               项目描述
 * @apiSuccess {Integer} project.create_time       创建时间
 * @apiSuccess {Integer} project.create_user       创建人
 * @apiSuccess {Integer} project.status            状态
 * (不会返回已删除的banner 只作为服务器参考)
 *
 * @apiSampleRequest /project/add
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *    {
    "project": {
        "id": "1",
        "pro_name": "牙科项目",
        "desc": "这是一个很好的项目",
        "create_time": 1510557470,
        "create_user": 1,
        "status": 1
    }
}
 *
 * @apiUse ERROR
 */
export async function createProject(ctx) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param.pro_name)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const currentUser = ctx.state.user;
    const projectOne = await Project.findOne({ where: {pro_name: param.pro_name},attributes:['id','pro_name'] });
    if(projectOne){
        ctx.body = NET.error("项目名称不可重复");
        return
    }
    const project = await Project.create({
        pro_name: param.pro_name,
        desc: param.desc,
        create_time : getSecond(),
        create_user : currentUser.id
    });
    if(project){
      ctx.body = {"code":1 ,"msg": project}
    }else {
      ctx.body = NET.error("失败");
    }
}

/**
 * @api {post} /project/viewProject 项目查看
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName viewProject
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "project_id": project_id }' 'http://localhost:3000/project/viewProject'
 * @apiParam {Integer} project_id                  项目ID.
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
 * @apiSampleRequest /project/viewProject
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
export async function viewProjectList(ctx) {
    const currentUser = ctx.state.user;
    const project_id = ctx.request.body.project_id;
    if(isEmpty(project_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    const industryTypeData = await Industry_type.getIndustryType();
    const projectData = await Project.getProject(project_id);
    if(projectData.dataValues.status!=1 || currentUser.role_id==2){
        var businessData = await BusinessModle.findAll({ where: { project_id: project_id },attributes:['id','industry_info','create_time','create_user','weight','status','to_user','project_id','distribution_time'] });
        if(businessData.length!=0){
            for (let value of Object.values(businessData)) {
                if(value.dataValues.to_user!=0){
                    const user = await AdminUser.findOne({ where: { id: value.dataValues.to_user },attributes:['id','username'] });
                    value.dataValues.username = user.dataValues.username;
                }
            }
        }
    }else{
        var businessData = {};
    }
    ctx.body    = NET.success({businessData,industryTypeData,projectData})
}


/**
 * @api {post} /project/addBusinessModle 生成模式类型
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName createBusinessModle
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{"modleWeight": modleWeight,"industryIds": industryIds,"project_id": project_id}' 'http://localhost:3000/project/addBusinessModle'
 * @apiParam   {Integer} modleWeight                    分值
 * @apiParam   {String} industryIds                    体系ID和名称（json）.
 * @apiParam   {Integer} project_id                     项目ID

 * @apiSuccess {Object} businessData                    业务模式信息
 * @apiSuccess {String} businessData.industry_info           体系ID和名称（json）.
 * @apiSuccess {Integer} businessData.create_time               创建时间
 * @apiSuccess {Integer} businessData.create_user       创建人
 * @apiSuccess {Integer} businessData.weight       分值
 * @apiSuccess {Integer} businessData.status            状态
 * @apiSuccess {Integer} businessData.to_user            分配人
 * @apiSuccess {Integer} businessData.project_id            项目ID
 * (不会返回已删除的banner 只作为服务器参考)
 *
 * @apiSampleRequest /project/addBusinessModle
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *    {
    "businessData": {
        "industry_info": [{"industry_id":"33","industry_name":"\u773c\u79d1","count_id":"116"}],
        "create_time": 1510557470,
        "create_user": 1,
        "weight": 80,
        "status": 1,
        "to_user": 0,
        "project_id": 18
    }
}
 *
 * @apiUse ERROR
 */
export async function createBusinessModle(ctx) {
    const currentUser = ctx.state.user;
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const businessModle = await BusinessModle.create({
        industry_info : param.industryIds,
        create_time : getSecond(),
        create_user : currentUser.id,
        weight : param.modleWeight,
        status : 1,
        to_user : 0,
        project_id : param.project_id
    });
    const businessData = await BusinessModle.findAll({ where: { project_id: param.project_id },attributes:['id','industry_info','create_time','create_user','weight','status','to_user','project_id'] });
    ctx.body    = NET.success({businessData})
}


/**
 * @api {post} /project/getIndustry 获取知识体系接口
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName getIndustryData
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{"typeId": typeId}' 'http://localhost:3000/project/getIndustry'
 * @apiParam   {Integer} typeId                    行业类型

 * @apiSuccess {Object} arrRes                    知识体系信息
 * @apiSuccess {String} arrRes.id                  表中的主键id
 * @apiSuccess {Integer} arrRes.pid                父级ID
 * @apiSuccess {Integer} arrRes.count_id           记录层级结构的ID
 * @apiSuccess {String} arrRes.sysname             体系名称
 * @apiSuccess {Integer} arrRes.user_type          1行业专家 2数据经理
 * @apiSuccess {Integer} arrRes.type_id          体系名字ID
 * (不会返回已删除的banner 只作为服务器参考)
 *
 * @apiSampleRequest /project/getIndustry
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *    {
    "arrRes": {
        "id": 1,
        "pid": 1,
        "count_id": 1,
        "sysname": "好项目好项目",
        "user_type": 1
    }
}
 *
 * @apiUse ERROR
 */
export async function getIndustryData(ctx) {
    const typeId = ctx.request.body.typeId;
    if(isEmpty(typeId)){
        ctx.body = NET.error("参数错误");
        return
    }
    const industrySystermData = await Industry_systerm.findAll({ where: { type_id: typeId },attributes:['id','pid','count_id','sysname','user_type','type_id'] });

    let {keys,values,entries} = Object;
    let arrRes = [];
    for (let value of values(industrySystermData)) {
        arrRes.push(value);
    }
    ctx.body    = NET.success({arrRes})
}
 /**
 * @api {post} /project/finishCreateProject 创建完成
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName finishCreateProject
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/project/finishCreateProject'
 * @apiParam   {Integer} project_id                    project_id
 *
 * @apiSuccess {Object} Project                    项目信息
 * @apiSuccess {String} Project.pro_name           项目名称.
 * @apiSuccess {String} Project.desc               项目描述
 * @apiSuccess {Integer} Project.create_time       创建时间
 * @apiSuccess {Integer} Project.create_user       创建人
 * @apiSuccess {Integer} Project.status            状态
 *
 * @apiSampleRequest /project/finishCreateProject
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "Project": {
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
export async function finishCreate(ctx) {
    const Project = ctx.body.projectData;
    Project.status = 2;

    await Project.save();
    ctx.body    = NET.success({Project})
}
/**
 * @api {post} /project/selectFeatureLibrary 查看特征库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName selectFeatureLibrary
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/project/selectFeatureLibrary'
 * @apiParam {Integer} business_id                   模式类型ID.
 * @apiParam {Integer} projectId                   项目ID.
 *
 * @apiSuccess {Object} businessData                            业务模式信息
 * @apiSuccess {String} businessData.industry_info              体系ID和名称（json）.
 * @apiSuccess {Integer} businessData.create_time               创建时间
 * @apiSuccess {Integer} businessData.create_user               创建人
 * @apiSuccess {Integer} businessData.weight                    分值
 * @apiSuccess {Integer} businessData.status                    状态
 * @apiSuccess {Integer} businessData.to_user                   分配人
 * @apiSuccess {Integer} businessData.project_id                项目ID
 * @apiSuccess {Object} characterData                            特征库信息
 * @apiSuccess {Integer} characterData.industry_ids              体系ID.
 * @apiSuccess {Integer} characterData.channel_ids               渠道ID
 * @apiSuccess {Integer} characterData.weight                    分值
 * @apiSuccess {Integer} characterData.create_time               创建时间
 * @apiSuccess {Integer} characterData.to_user                   分配人
 * @apiSuccess {Integer} characterData.create_user               用户ID
 * @apiSuccess {Integer} characterData.distribution_time         分配时间
 * @apiSuccess {String} characterData.industry_name               体系名字
 * @apiSuccess {String} characterData.channel_name                渠道名字
 *
 * @apiSampleRequest /project/selectFeatureLibrary
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "businessData": {
                        "id": 29,
                        "industry_info": "[{\"industry_id\":\"2\",\"industry_name\":\"\\u8bed\\u4e49\\u8bc6\\u522b\",\"count_id\":\"101\"},{\"industry_id\":\"14\",\"industry_name\":\"\\u76f8\\u5173\",\"count_id\":\"113\"},{\"industry_id\":\"3\",\"industry_name\":\"\\u4e0a\\u7f51\",\"count_id\":\"102\"}]",
                        "create_time": 1509100138,
                        "create_user": 1,
                        "weight": 33,
                        "status": 1,
                        "to_user": 0,
                        "project_id": 18,
                        "distribution_time": null
                    },"characterData": [
                        {
                            "id": 1,
                            "industry_ids": "11",
                            "channel_ids": "5",
                            "weight": 0,
                            "create_time": 1509070456,
                            "to_user": 0,
                            "create_user": 1,
                            "distribution_time": null,
                            "industry_sysname": "体系体系体系",
                            "channel_sysname": "行业职位渠道"
                        }
                    ]
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function selectFeatureLibrary(ctx) {
    const business_id = ctx.request.body.business_id;
    const projectId = ctx.request.body.projectId;
    if(isEmpty(business_id)||isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return
    }
    //项目状态
    const projectStatus = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(!projectStatus){
        ctx.body = NET.error("无此项目！");
        return
    }
    const currentUser = ctx.state.user;
    //模式类型数据
    const businessData = await BusinessModle.findOne({ where: { id: business_id } });
    //
    if(projectStatus.dataValues.status>3){
        const relationData = await RelationTables.findOne({ where: { business_id: business_id },attributes:['id','project_id','business_id','charact_id'] });
        if(relationData){
            const charact_id = eval("("+relationData.dataValues.charact_id+")");  
            var characterData = await Character.findAll({ where: {id : charact_id},order : [['create_time', 'DESC']] });
            for (let value of Object.values(characterData)) {
                const industryData = await Industry_systerm.findOne({ where: {id: value.dataValues.industry_ids},attributes:['id','sysname'] });
                value.dataValues.industry_sysname = industryData.sysname;
                const channelData = await Channel_systerm.findOne({ where: {id: value.dataValues.channel_ids},attributes:['id','sysname'] });
                value.dataValues.channel_sysname = channelData.sysname;
                if(value.dataValues.to_user){
                    const user = await AdminUser.findOne({ where: {id: value.dataValues.to_user},attributes:['id','username'] });
                    value.dataValues.username = user.username;
                }
            }
        }else{
            var characterData = [];
        }
    }else{
        var characterData = [];
    }
    ctx.body    = NET.success({businessData,characterData,projectStatus})
}
/**
 * @api {post} /project/FeatureLibraryDetailedList 特征库详单
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName FeatureLibraryDetailedList
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id,"charact_id": charact_id }' 'http://localhost:3000/project/FeatureLibraryDetailedList'
 * @apiParam {Integer} business_id                   模式类型ID.
 * @apiParam {Integer} charact_id                   特征库ID.
 *
 * @apiSuccess {Object} businessData                            业务模式信息
 * @apiSuccess {String} businessData.industry_info              体系ID和名称（json）.
 * @apiSuccess {Integer} businessData.create_time               创建时间
 * @apiSuccess {Integer} businessData.create_user               创建人
 * @apiSuccess {Integer} businessData.weight                    分值
 * @apiSuccess {Integer} businessData.status                    状态
 * @apiSuccess {Integer} businessData.to_user                   分配人
 * @apiSuccess {Integer} businessData.project_id                项目ID
 * @apiSuccess {Object} characterData                            特征库信息
 * @apiSuccess {Integer} characterData.industry_ids              体系ID.
 * @apiSuccess {Integer} characterData.channel_ids               渠道ID
 * @apiSuccess {Integer} characterData.weight                    分值
 * @apiSuccess {Integer} characterData.create_time               创建时间
 * @apiSuccess {Integer} characterData.to_user                   分配人
 * @apiSuccess {Integer} characterData.create_user               用户ID
 * @apiSuccess {Integer} characterData.distribution_time         分配时间
 * @apiSuccess {String} characterData.industry_name               体系名字
 * @apiSuccess {String} characterData.channel_name                渠道名字
 *
 * @apiSampleRequest /project/FeatureLibraryDetailedList
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "businessData": {
                        "id": 29,
                        "industry_info": "[{\"industry_id\":\"2\",\"industry_name\":\"\\u8bed\\u4e49\\u8bc6\\u522b\",\"count_id\":\"101\"},{\"industry_id\":\"14\",\"industry_name\":\"\\u76f8\\u5173\",\"count_id\":\"113\"},{\"industry_id\":\"3\",\"industry_name\":\"\\u4e0a\\u7f51\",\"count_id\":\"102\"}]",
                        "create_time": 1509100138,
                        "create_user": 1,
                        "weight": 33,
                        "status": 1,
                        "to_user": 0,
                        "project_id": 18,
                        "distribution_time": null
                    },"characterData": {
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
                    },"characterMess": [
                        {
                            "id": 8,
                            "message": "龅牙",
                            "character_id": 1
                        },
                        {
                            "id": 9,
                            "message": "歪牙",
                            "character_id": 1
                        }
                    ]
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function FeatureLibraryDetailedList(ctx) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //业务模式
    const businessData = await BusinessModle.findOne({ where: {id : param.business_id} });
    if(!businessData){
        ctx.body = NET.error("业务模式为空");
        return
    }
    //特征库信息
    const characterData = await Character.findOne({ where: {id : param.charact_id},attributes:['id','industry_ids','channel_ids','weight','create_time','to_user','create_user','distribution_time'] });
    const industryData = await Industry_systerm.findOne({ where: {id: characterData.dataValues.industry_ids},attributes:['id','sysname'] });
    characterData.dataValues.industry_name = industryData.sysname;
    const channelData = await Channel_systerm.findOne({ where: {id: characterData.dataValues.channel_ids},attributes:['id','sysname'] });
    characterData.dataValues.channel_name = channelData.sysname;
    //特征库详单
    const characterMess = await CharacterMess.findAll({ where: {character_id: param.charact_id},attributes:['id','message','character_id'] });
    if(characterMess.length==0){
        ctx.body = NET.error("详单为空");
        return
    }

    ctx.body    = NET.success({businessData,characterData,characterMess})
}
/**
 * @api {post} /project/delete 删除项目
 * @apiPermission 管理后台
 * @apiVersion 1.0.0 
 * @apiName projectDel
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/project/delete'
 * @apiParam   {Integer} projectId                   项目id
 
 * @apiSampleRequest /project/delete
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *  {
    success: true
}
 *
 * @apiUse ERROR
 */
export async function projectDel(ctx) {
    const projectId = ctx.request.body.projectId;
    console.log(projectId)
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const businessData = await BusinessModle.findAll({ where : { project_id: projectId } });
    if(businessData.length!=0){
        ctx.body = NET.error("当前项目有业务模式，不可删除！");
        return;
    }
    const projectRes = await Project.destroy({ where : { id: projectId } });
    if(projectRes){
        ctx.body = NET.success("删除成功");
    }else {
      ctx.body = NET.error("删除失败");
    }
}
/**
 * @api {post} /project/deleteBusinessModel 删除业务模式
 * @apiPermission 管理后台
 * @apiVersion 1.0.0 
 * @apiName businessModelDel
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/project/deleteBusinessModel'
 * @apiParam   {Integer} businessId                   业务模式id
 
 * @apiSampleRequest /project/deleteBusinessModel
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *  {
    success: true
}
 *
 * @apiUse ERROR
 */
export async function businessModelDel(ctx) {
    const businessId = ctx.request.body.businessId;
    if(isEmpty(businessId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const businessRes = await BusinessModle.destroy({ where : { id: businessId } });
    if(businessRes){
        ctx.body = NET.success("删除成功");
    }else {
      ctx.body = NET.error("删除失败");
    }
}
/**
 * @api {post} /project/submit 提交业务模式
 * @apiPermission 管理后台
 * @apiVersion 1.0.0 
 * @apiName submit
 * @apiGroup project
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{}' 'http://localhost:3000/project/submit'
 * @apiParam   {Integer} projectId                   项目id
 * @apiSampleRequest /project/submit
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *  {
    success: true
}
 *
 * @apiUse ERROR
 */
export async function submit(ctx) {
    const projectId = ctx.request.body.projectId;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const businessData = await BusinessModle.findAll({ where : { project_id: projectId } });
    if(businessData.length==0){
        ctx.body = NET.error("不可直接提交！");
        return;
    }
    const projectData = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(projectData&&projectData.dataValues.status==1){
        if(projectData.dataValues.status==2){
            ctx.body = NET.error("项目业务模式已创建，不可提交！");
            return;
        }
        projectData.status = 2;
        await projectData.save();
        if(projectData){
            ctx.body = NET.success("提交成功");
        }else {
          ctx.body = NET.error("提交失败");
        }
    }else{
        ctx.body = NET.error("项目参数错误");
    }
}






















export async function getProjectData(ctx, next) {
    const project_id = ctx.request.body.project_id;
    if(isEmpty(project_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    try {
        const projectData = await Project.findOne({ where: { id: project_id } });
        if (!projectData) {
            ctx.throw(404)
        }
        ctx.body = { projectData }
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
