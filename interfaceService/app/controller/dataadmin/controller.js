/**
 * Created by gy at 2017/12/6 下午1:00
 *
 * Desc :
 */
import { Industry_type } from '../../modles'
import { AdminUser } from '../../modles'
import { Project } from '../../modles'
import { Industry_systerm } from '../../modles'
import { BusinessModle } from '../../modles'
import { RelationTables } from '../../modles'
import { Character } from '../../modles'
import { Channel_type } from '../../modles'
import { Channel_systerm } from '../../modles'

import passport from 'koa-passport';
import { MANAGER_LIMIT,NET } from '../../config/config'
import { getSecond,isEmpty } from '../../utils/importUtils'

 /**
 * @api {post} /dataadmin/list 分配体系完善任务列表
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "type_name": type_name ,"status": status ,"page": page}' 'http://localhost:3000/dataadmin/list'
 * @apiParam {String} type_name                  体系名称.
 * @apiParam {Integer} status                   状态.
 * @apiParam {Integer} page                     页码.
 *
 * @apiSuccess {Object} industryList                    体系信息
 * @apiSuccess {String} industryList.type_name           体系名称.
 * @apiSuccess {String} industryList.desc               体系描述
 * @apiSuccess {Integer} industryList.create_time       创建时间
 * @apiSuccess {Integer} industryList.create_user       创建人
 * @apiSuccess {Integer} industryList.to_user            所属用户
 * @apiSuccess {Integer} industryList.status            状态
 *
 * @apiSampleRequest /dataadmin/list
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryList": {
                        "type_name": "体系名称",
                        "desc": "这是一个很好的体系描述",
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
export async function industryDistList(ctx) {
    const type_name = ctx.request.body.type_name;
    const status = ctx.request.body.status;
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
    var count = await Industry_type.count({ where: obj })
    const industryList = await Industry_type.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(industryList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body = NET.success({industryList,count})
}
 /**
 * @api {post} /dataadmin/findIndestry 获取单条体系数据
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName findIndestry
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id }' 'http://localhost:3000/dataadmin/findIndestry'
 * @apiParam {Integer} industry_id                   状态.
 *
 * @apiSuccess {Object} industryTypeDate                    体系信息
 * @apiSuccess {String} industryTypeDate.type_name           体系名称.
 * @apiSuccess {String} industryTypeDate.desc               体系描述
 * @apiSuccess {Integer} industryTypeDate.create_time       创建时间
 * @apiSuccess {Integer} industryTypeDate.create_user       创建人
 * @apiSuccess {Integer} industryTypeDate.to_user            所属用户
 * @apiSuccess {Integer} industryTypeDate.status            状态
 *
 * @apiSampleRequest /dataadmin/findIndestry
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryTypeDate": {
                        "type_name": "体系名称",
                        "desc": "这是一个很好的体系描述",
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
export async function findIndestryData(ctx) {
    const industry_id = ctx.request.body.industry_id;
    if(isEmpty(industry_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    const industryTypeDate = await Industry_type.findOne({ where: {id: industry_id} });
    const user = await AdminUser.findOne({ where: {id: industryTypeDate.create_user},attributes:['id','username'] });
    industryTypeDate.dataValues.username = user.username;
    ctx.body    = NET.success({industryTypeDate})
}
 /**
 * @api {post} /dataadmin/dataManager 获取数据经理/数据专员
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName dataManager
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "manager_id": manager_id }' 'http://localhost:3000/dataadmin/dataManager'
 * @apiParam {Integer} manager_id                   数据经理ID.
 *
 * @apiSuccess {Object} managerData                    数据经理信息
 * @apiSuccess {String} managerData.username           数据经理名字.
 * @apiSuccess {Integer} managerData.role_id           角色ID.
 *
 * @apiSampleRequest /dataadmin/dataManager
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "managerData": {
                        "username": "数据经理",
                        "role_id": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function getDataManager(ctx) {
    const manager_id = ctx.request.body.manager_id;
    if(isEmpty(manager_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    const managerData = await AdminUser.findAll({ where: {role_id: manager_id},order : [['reg_time', 'DESC']],attributes:['id','username','role_id'] });
    if(!managerData){
        ctx.body = NET.error("暂无人员信息");
        return;
    }
    ctx.body    = NET.success({managerData})
}
 /**
 * @api {post} /dataadmin/distribution 分配任务入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName distribution
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "industry_id": industry_id,"to_user": to_user }' 'http://localhost:3000/dataadmin/distribution'
 * @apiParam {Integer} industry_id                   体系ID.
 * @apiParam {Integer} to_user                   分配的人.
 *
 * @apiSuccess {Object} industryTypeDate                    体系信息
 * @apiSuccess {String} industryTypeDate.type_name           体系名称.
 * @apiSuccess {String} industryTypeDate.desc               体系描述
 * @apiSuccess {Integer} industryTypeDate.create_time       创建时间
 * @apiSuccess {Integer} industryTypeDate.create_user       创建人
 * @apiSuccess {Integer} industryTypeDate.to_user            所属用户
 * @apiSuccess {Integer} industryTypeDate.distribution_time            分配任务时间
 * @apiSuccess {Integer} industryTypeDate.status            状态
 *
 * @apiSampleRequest /dataadmin/distribution
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "industryTypeDate": {
                        "type_name": "体系名称",
                        "desc": "这是一个很好的体系描述",
                        "create_time": 1510557470,
                        "create_user": 1,
                        "to_user": 1,
                        "distribution_time": 1510557470,
                        "status": 1
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function distributionAdd(ctx) {
    const Industry_type = ctx.body.industryType;
    Industry_type.to_user = ctx.request.body.to_user;
    Industry_type.distribution_time = getSecond();
    Industry_type.status = 3;
    await Industry_type.save();
    if(Industry_type){
        ctx.body = NET.success("分配成功");
    }else {
      ctx.body = NET.error("分配失败");
    }
}
 /**
 * @api {post} /dataadmin/projectList 项目列表 选择特征库任务分配
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName projectList
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "pro_name": pro_name ,"status": status,"page": page}' 'http://localhost:3000/project/projectList'
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
 * @apiSampleRequest /dataadmin/projectList
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
export async function projectListData(ctx) {
    const pro_name = ctx.request.body.pro_name;
    const status = ctx.request.body.status;
    const countLimit = MANAGER_LIMIT
    var page = ctx.request.body.page;
    let obj ={};
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
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body    = NET.success({projectList})
}
/**
 * @api {post} /dataadmin/distributionPage 项目查看
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName distributionPage
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "project_id": project_id, "status": status }' 'http://localhost:3000/dataadmin/distributionPage'
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
 * @apiSampleRequest /dataadmin/distributionPage
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
export async function distributionView(ctx) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const industryTypeData = await Industry_type.getIndustryType();
    const projectData = await Project.getProject(param.project_id);
    const businessData = await BusinessModle.findOne({ where: { project_id: param.project_id, status: param.status } });
    ctx.body    = NET.success({businessData,industryTypeData,projectData})
}
 /**
 * @api {post} /dataadmin/distributionFeatures 分配选业务模式入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName distributionFeatures
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/dataadmin/distributionFeatures'
 * @apiParam {Integer} business_id                   业务模式ID.
 * @apiParam {Integer} to_user                   分配人.
 *
 * @apiSuccess {Object} businessData                    业务模式信息
 * @apiSuccess {String} businessData.industry_info           体系ID和名称（json）.
 * @apiSuccess {Integer} businessData.create_time               创建时间
 * @apiSuccess {Integer} businessData.create_user       创建人
 * @apiSuccess {Integer} businessData.weight       分值
 * @apiSuccess {Integer} businessData.status            状态
 * @apiSuccess {Integer} businessData.to_user            分配人
 * @apiSuccess {Integer} businessData.project_id            项目ID
 *
 * @apiSampleRequest /dataadmin/distributionFeatures
 * @apiSuccessExample {json} 成功返回
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
                        "project_id": 18,
                        "username": root,
                        "distribution_time": 544353543
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function distributionFeaturesAdd(ctx) {
    const BusinessModle = ctx.body.businessAr;
    BusinessModle.to_user = ctx.request.body.to_user;
    BusinessModle.distribution_time = getSecond();
    BusinessModle.status = 2;

    await BusinessModle.save();
    const user = await AdminUser.findOne({ where: { id: BusinessModle.dataValues.to_user },attributes:['id','username'] });
    BusinessModle.dataValues.username = user.dataValues.username;
    ctx.body    = NET.success({BusinessModle})
}
/**
 * @api {post} /dataadmin/selectFeatureLibrary 查看特征库（分配）
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName selectFeatureLibrary
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/dataadmin/selectFeatureLibrary'
 * @apiParam {Integer} business_id                   模式类型ID.
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
 * @apiSampleRequest /dataadmin/selectFeatureLibrary
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
                            "industry_name": "33333",
                            "channel_name": "行业职位渠道"
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
    if(isEmpty(business_id)){
        ctx.body = NET.error("参数错误");
        return
    }
    const relationData = await RelationTables.findOne({ where: { business_id: business_id },attributes:['id','project_id','business_id','charact_id'] });
    const businessData = await BusinessModle.findOne({ where: { id: business_id } });
    const charact_id = eval("("+relationData.dataValues.charact_id+")");
    const characterData = await Character.findAll({ where: {id : charact_id},order : [['create_time', 'DESC']] });
    for (let value of Object.values(characterData)) {
        const industryData = await Industry_systerm.findOne({ where: {id: value.dataValues.industry_ids},attributes:['id','sysname'] });
        value.dataValues.industry_name = industryData.sysname;
        const channelData = await Channel_systerm.findOne({ where: {id: value.dataValues.channel_ids},attributes:['id','sysname'] });
        value.dataValues.channel_name = channelData.sysname;
    }
    ctx.body    = NET.success({businessData,characterData})
}
 /**
 * @api {post} /dataadmin/distributionCharacter 分配 特征库 任务入库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName distributionCharacter
 * @apiGroup dataadmin
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/dataadmin/distributionCharacter'
 * @apiParam {Integer} charact_id                   特征库ID.
 * @apiParam {Integer} to_user                   分配人.
 *
 * @apiSuccess {Object} Character                            特征库信息
 * @apiSuccess {Integer} Character.industry_ids              体系ID.
 * @apiSuccess {Integer} Character.channel_ids               渠道ID
 * @apiSuccess {Integer} Character.weight                    分值
 * @apiSuccess {Integer} Character.create_time               创建时间
 * @apiSuccess {Integer} Character.to_user                   分配人
 * @apiSuccess {Integer} Character.create_user               用户ID
 * @apiSuccess {Integer} Character.distribution_time         分配时间
 * @apiSuccess {String} Character.industry_name               体系名字
 * @apiSuccess {String} Character.channel_name                渠道名字
 *
 * @apiSampleRequest /dataadmin/distributionCharacter
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                "data": {
                    "Character": {
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
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function distributionCharacterAdd(ctx) {
    //分配特征库
    const Character = ctx.body.characterData;
    Character.to_user = ctx.request.body.to_user;
    Character.distribution_time = getSecond();
    Character.status = 2;
    await Character.save();
    ctx.body    = NET.success({Character})
}

//提交分配后的业务模式
export async function businessSubmit(ctx) {
    const projectId = ctx.request.body.projectId;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const projectData = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(projectData&&projectData.dataValues.status==2){
        projectData.status = 3;
        await projectData.save();
        if(projectData){
            ctx.body = NET.success("业务模式提交成功");
        }else {
            ctx.body = NET.error("提交失败");
        }
    }else{
        ctx.body = NET.error("非法提交");
    }
}
//提交分配后的特征库
export async function characterSubmit(ctx) {
    const projectId = ctx.request.body.projectId;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const projectData = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(projectData&&projectData.dataValues.status==5){
        projectData.status = 6;
        await projectData.save();
        if(projectData){
            ctx.body = NET.success("特征库分配提交成功");
        }else {
            ctx.body = NET.error("提交失败");
        }
    }else{
        ctx.body = NET.error("非法提交!");
    }
}












//获取修改 知识体系 单条数据
export async function getIndustryTypeData(ctx, next) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    try {
        const industryType = await Industry_type.findOne({ where: { id: param.industry_id } });
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
//获取 模式类型 单条数据
export async function getBusinessModleData(ctx, next) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    try {
        const businessAr = await BusinessModle.findOne({ where: { id: param.business_id } });
        if (!businessAr) {
            ctx.throw(404)
        }
        ctx.body = { businessAr }
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
//获取修改 特征库 单条数据
export async function getCharacterData(ctx, next) {
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    try {
        const characterData = await Character.findOne({ where: { id: param.charact_id } });
        if (!characterData) {
            ctx.throw(404)
        }
        ctx.body = { characterData }
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