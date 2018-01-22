/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as project from './controller'

export const baseUrl = '/project'


export default [{
	    method: 'POST',
	    route: '/list',
	    handlers: [project.projectList]
	},{
        method: 'POST',
        route: '/industryList',
        handlers: [project.industryType]
    },{
        method: 'POST',
        route: '/add',
        handlers: [project.createProject]
    },{
        method: 'POST',
        route: '/viewProject',
        handlers: [project.viewProjectList]
    },{
        method: 'POST',
        route: '/addBusinessModle',
        handlers: [project.createBusinessModle]
    },{
        method: 'POST',
        route: '/getIndustry',
        handlers: [project.getIndustryData]
    },{
        method: 'POST',
        route: '/finishCreateProject',
        handlers: [project.getProjectData, project.finishCreate]
    },{
        method: 'POST',
        route: '/selectFeatureLibrary',
        handlers: [project.selectFeatureLibrary]
    },{
        method: 'POST',
        route: '/FeatureLibraryDetailedList',
        handlers: [project.FeatureLibraryDetailedList]
    },{
        method: 'POST',
        route: '/delete',
        handlers: [project.projectDel]
    },{
        method: 'POST',
        route: '/deleteBusinessModel',
        handlers: [project.businessModelDel]
    },{
        method: 'POST',
        route: '/submit',
        handlers: [project.submit]
    }
]