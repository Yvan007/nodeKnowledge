// const ip = 'http://192.168.1.202:3000'
// const ip = 'http://192.168.1.32:3000'
const ip = 'http://localhost:3000'
var obj = {
  // 登录
  login: '/adminUser/login',
  // 登出
  loginOut: '/adminUser/loginOut',
  /* 渠道 channel */
  // 修改渠道
  channelSave: '/channel/save',
  // 完善渠道页面 *******
  channelPerfectView: '/channel/perfectView',
  // 查看渠道 ********
  channelView: '/channel/channelView',
  // 添加渠道 ＊＊＊＊＊＊＊＊＊＊＊＊
  channelAdd: '/channel/add',
  // 渠道信息入库 ******
  channelCreate: '/channel/channelCreat',
  // 暂存渠道
  channelTemporaryAdd: '/channel/channelTemporaryAdd',
  // 渠道列表  ＊＊＊＊＊＊＊＊＊＊＊＊
  channelList: '/channel/list',

  /* DATAADMIN */
  // 分配特征库任务入库
  distributionCharacter: '/dataadmin/distributionCharacter',
  // 分配任务入库
  distribution: '/dataadmin/distribution',
  // 分配体系完善任务列表
  dataadminList: '/dataadmin/list',
  // 分配模式类型选择特征库任务入库
  distributionFeatures: '/dataadmin/distributionFeatures',
  // 查看特征库(分配)
  dataadminSelectFeatureLibrary: '/dataadmin/selectFeatureLibrary',
  // 获取单条体系数据
  findIndestry: '/dataadmin/findIndestry',
  // 获取数据经理 ******
  dataManager: '/dataadmin/dataManager',
  // 项目列表选择特征库任务分配
  dataProjectList: '/dataadmin/projectList',
  // 项目查看 *******
  distributionPage: '/dataadmin/distributionPage',

  /* DATAMINAGER */
  // 体系列表(数据经理)  ****
  datamanagerList: '/datamanager/list',
  // 完善体系页面 ****
  perfectIndustry: '/datamanager/perfectIndustry',
  // 提交 ******
  featureLibrarySubmit: '/datamanager/featureLibrarySubmit',
  // 业务模式总提交
  businessSubmission: '/datamanager/businessSubmission',
  // 数据经理完善体系入库
  industrySystermAdd: '/datamanager/industrySystermAdd',
  // 生成实例
  createCase: '/datamanager/createCase',
  // 查看实例
  selectCase: '/datamanager/selectCase',
  // 生成特征库 ******
  featureLibraryCreate: '/datamanager/featureLibraryCreate',
  // 删除业务特征库
  featureLibraryDel: '/datamanager/featureLibraryDel',
  // 获取体系树(数据经理) *****
  getIndustryBytype: '/datamanager/getIndustryBytype',
  // 查看体系  *****
  industryView: '/datamanager/industryView',
  // 选择特征库(数据经理)  *****
  choiceFeatureLibrary: '/datamanager/choiceFeatureLibrary',
  // 项目分配选择特征库任务(数据经理) ******
  datamanagerProjectDetails: '/datamanager/projectDetails',
  // 项目列表(数据经理) *****
  datamanagerProjectList: '/datamanager/projectList',

  /* DATASTEWARD */
  // 完善特征库入库(数据专员)
  perfectFeatureLibrary: '/datasteward/perfectFeatureLibrary',
  // 完善特征库详情页(数据专员)
  perfectView: '/datasteward/perfectView',
  // 查看特征库
  datastewardSelectFeatureLibrary: '/datasteward/selectFeatureLibrary',
  // 项目完善特征库(数据专员)
  projectDetails: '/datasteward/projectDetails',
  // 项目列表(数据专员)  ****
  datastewardList: '/datasteward/list',



  /* INDUSTRY */
  // 体系信息库入库  *********
  industryCreat: '/industry/industryCreat',
  // 体系列表　＊＊＊＊＊＊＊＊＊＊＊＊
  industryList: '/industry/list',
  // 修改体系  ***
  industrySave: '/industry/save',
  // 完善体系页面 **********
  industryPerfectView: '/industry/perfectView',
  // 查看体系  ＊＊＊＊＊＊＊＊＊＊＊＊
  industryIndustryView: '/industry/industryView',
  // 添加体系  ＊＊＊＊＊＊＊＊＊＊＊＊
  industryAdd: '/industry/add',
  // 暂存体系
  industryTemporaryAdd: '/industry/industryTemporaryAdd',

  /* PURSCHE */
  // 获取用户推送内容
  getUserContent: '/porsche/getUserContent',
  // 获取用户站内信接口
  getUserTpl: '/porsche/getUserTpl',

  /* PROJECT */
  // 创建完成 *****
  finishCreateProject: '/project/finishCreateProject',
  // 新增项目 ＊＊＊＊＊＊＊＊＊＊＊＊
  projectAdd: '/project/add',
  // 查看特征库
  selectFeatureLibrary: '/project/selectFeatureLibrary',
  // 特征库详单
  FeatureLibraryDetailedList: '/project/FeatureLibraryDetailedList',
  // 生成模式类型 **********
  addBusinessModle: '/project/addBusinessModle',
  // 获取知识体系 **********
  getIndustry: '/project/getIndustry',
  // 项目列表　＊＊＊＊＊＊＊＊＊＊＊＊
  projectList: '/project/list',
  // 项目查看  ＊＊＊＊＊＊＊＊＊＊＊＊
  projectViewProject: '/project/viewProject',
  // 业务模式创建  ＊＊＊＊＊＊＊＊＊＊＊＊
  projectSubmit: '/project/submit',
  // 业务模式提交
  businessSubmit: '/dataadmin/businessSubmit',
  // 特征库分配提交
  characterSubmit: '/dataadmin/characterSubmit',
  // 删除业务模式  ＊＊＊＊＊＊＊＊＊＊＊＊
  deleteBusinessModel: '/project/deleteBusinessModel',
  // 提交特征库详单  ＊＊＊＊＊＊＊＊＊＊＊＊
  perfectFeatureLibrarySubmit: '/datasteward/perfectFeatureLibrarySubmit',
  // 特征库总提交
  perfectFeatureLibraryTotalSubmit: '/datasteward/perfectFeatureLibraryTotalSubmit',
  // 删除项目 ＊＊＊＊＊＊＊＊＊＊＊＊
  projectDelete: '/project/delete',
  // 生成配置文件
  datamanagerExportYaml: '/datamanager/createYamlFile',
  // 导出配置文件
  datamanagerExportYamlFile: '/datamanager/exportYamlFile'
}
var port = {}
for (var k in obj){
  port[k] = ip + obj[k]
}

export default port
