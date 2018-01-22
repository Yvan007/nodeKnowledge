/**
 * Created by gy at 2017/12/6 下午1:00
 *
 * Desc :
 */
import { Industry_type } from '../../modles'
import { Industry_systerm } from '../../modles'
import { Channel_systerm } from '../../modles'
import { AdminUser } from '../../modles'
import { Project } from '../../modles'
import { BusinessModle } from '../../modles'
import { RelationTables } from '../../modles'
import { Channel_type } from '../../modles'
import { Character } from '../../modles'
import { CharacterMess } from '../../modles'

import passport from 'koa-passport';
import { MANAGER_LIMIT,NET } from '../../config/config'
import { getSecond,isEmpty } from '../../utils/importUtils'

 /**
 * @api {post} /datasteward/list 项目列表(数据专员)
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName list
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "pro_name": pro_name ,"status": status,"page": page}' 'http://localhost:3000/datasteward/list'
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
 * @apiSampleRequest /datasteward/list
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
    var count = await Project.count({where: obj})
    const projectList = await Project.findAll({ where: obj,order : [['create_time', 'DESC']],limit:[page * countLimit,countLimit] });
    let {keys,values,entries} = Object;
    for (let value of values(projectList)) {
        const user = await AdminUser.findOne({ where: {id: value.dataValues.create_user},attributes:['id','username'] });
        value.dataValues.username = user.username;
    }
    ctx.body    = NET.success({projectList,count})
}
/**
 * @api {post} /datasteward/projectDetails 项目 完善特征库 （数据专员）
 * @apiPermission 知识体系库
 * @apiVersion 1.0.0
 * @apiName projectDetails
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "project_id": project_id, "status": status }' 'http://localhost:3000/datasteward/projectDetails'
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
 * @apiSampleRequest /datasteward/projectDetails
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
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const industryTypeData = await Industry_type.getIndustryType();
    const projectData = await Project.getProject(param.project_id);
    const businessData = await BusinessModle.findOne({ where: { project_id: param.project_id, status: param.status },attributes:['id','industry_info','create_time','create_user','weight','status','to_user','project_id'] });
    ctx.body    = NET.success({businessData,industryTypeData,projectData})
}
/**
 * @api {post} /datasteward/selectFeatureLibrary 查看特征库
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName selectFeatureLibrary
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "business_id": business_id }' 'http://localhost:3000/datasteward/selectFeatureLibrary'
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
 * @apiSampleRequest /datasteward/selectFeatureLibrary
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
                        "distribution_time": 1509070456
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
                            "industry_name": "形容词",
                            "channel_name": "关键字"
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
 * @api {post} /datasteward/perfectView 完善特征库 详情页（数据专员）
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectView
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "charactId": charactId }' 'http://localhost:3000/datasteward/perfectView'
 * @apiParam {Integer} charactId                   业务特征ID.
 * @apiParam {Integer} page                        页码.
 *
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
 * @apiSampleRequest /datasteward/perfectView
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "characterData": {
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
 export async function perfectView(ctx) {
    const charactId = ctx.request.body.charactId;
    var page = ctx.request.body.page;
    const countLimit = MANAGER_LIMIT
    if(isEmpty(charactId)){
        ctx.body = NET.error("参数错误");
        return
    }
    const characterData = await Character.findOne({ where: {id : charactId} });
    //特征库数据
    const industryData = await Industry_systerm.findOne({ where: {id: characterData.dataValues.industry_ids},attributes:['id','sysname'] });
    characterData.dataValues.industry_name = industryData.sysname;
    const channelData = await Channel_systerm.findOne({ where: {id: characterData.dataValues.channel_ids},attributes:['id','sysname'] });
    characterData.dataValues.channel_name = channelData.sysname;

    if(page && page > 0) {
        page -= 1
    } else {
        page = 0
    }
    var count = await CharacterMess.count({ where:{character_id : charactId} })
    //特征库详单数据
    const characterMessData = await CharacterMess.findAll({ where: {character_id : charactId},limit:[page * countLimit,countLimit] });
    ctx.body    = NET.success({characterData,characterMessData,count})
}
/**
 * @api {post} /datasteward/perfectFeatureLibrary 完善特征库 入库（数据专员）
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectFeatureLibrary
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{  }' 'http://localhost:3000/datasteward/perfectFeatureLibrary'
 *
 * @apiSuccess {Object} characterMess                            特征库详单信息
 * @apiSuccess {Integer} characterMess.message                         URL
 * @apiSuccess {Integer} characterMess.character_id                    特征库ID
 *
 * @apiSampleRequest /datasteward/perfectFeatureLibrary
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
export async function perfectFeatureLibraryAdd(ctx) {
    const currentUser = ctx.state.user;
    //接受参数
    const param = ctx.request.body;
    if(isEmpty(param)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //特征库状态
    const CharacterData = await Character.findOne({ where : { id: param.character_id },attributes:['id','to_user'] });
    //判断是否是该分配人操作
    if(CharacterData.dataValues.to_user == currentUser.id){
        const characterMess = await CharacterMess.create({
            message: param.message,
            character_id: param.character_id
        });
        if(characterMess){
            ctx.body    = NET.success({characterMess})
        }else {
          ctx.body = NET.error("失败");
        }
    }else{
        ctx.body = NET.error("您不是该特征库分配人，无权限操作！");
        return;
    }
}
/**
 * @api {post} /datasteward/perfectFeatureLibrarySubmit 提交完善特征库（数据专员）
 * @apiPermission 用户
 * @apiVersion 1.0.0
 * @apiName perfectFeatureLibrarySubmit
 * @apiGroup datasteward
 * @apiExample 请求示例:
 * curl -H "Content-Type: application/json" -X POST -d '{  }' 'http://localhost:3000/datasteward/perfectFeatureLibrarySubmit'
 *
 * @apiSuccess {Integer} characterMess.character_id                    特征库ID
 *
 * @apiSampleRequest /datasteward/perfectFeatureLibrarySubmit
 * @apiSuccessExample {json} 成功返回
 *     HTTP/1.1 200 OK
 *     {
 *         {
                "code": 0,
                    "CharacterData": {
                        "id": 1,
                        "status": 3
                    }
                }
            }
 *     }
 *
 * @apiUse ERROR
 */
export async function perfectFeatureLibrarySubmit(ctx) {
    const businessId = ctx.request.body.businessId;
    const character_id = ctx.request.body.character_id;
    if(isEmpty(businessId)||isEmpty(character_id)){
        ctx.body = NET.error("参数错误");
        return;
    }
    //特征库状态
    const CharacterData = await Character.findOne({ where : { id: character_id },attributes:['id','status'] });
    //取出项目ID
    const relationData = await RelationTables.findOne({ where: { business_id: businessId },attributes:['id','project_id','business_id'] });
    //修改项目状态
    const projectData = await Project.findOne({ where : { id: relationData.dataValues.project_id },attributes:['id','status'] });
    if(CharacterData&&relationData&&projectData){
        if(projectData.dataValues.status==6){
            //特征库状态更新
            CharacterData.status = 3;
            await CharacterData.save();
            //项目状态更新
            projectData.status = 7;
            await projectData.save();
            ctx.body = NET.success("特征库详单提交成功");
        }else{
            ctx.body = NET.error("非法提交！");
        }
    }else {
        ctx.body = NET.error("提交失败");
    }
}
//特征库总提交
export async function perfectFeatureLibraryTotalSubmit(ctx){
    //接受参数
    const projectId = ctx.request.body.projectId;
    if(isEmpty(projectId)){
        ctx.body = NET.error("参数错误");
        return;
    }
    const projectData = await Project.findOne({ where : { id: projectId },attributes:['id','status'] });
    if(projectData){
        projectData.status = 8;
        await projectData.save();
        ctx.body    = NET.success({projectData})
    }else {
      ctx.body = NET.error("失败");
    }
 }