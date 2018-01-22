/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as datamanager from './controller'

export const baseUrl = '/datamanager'


export default [{
	    method: 'Post',
	    route: '/list',
	    handlers: [datamanager.industryList]
	},{
        method: 'Post',
        route: '/perfectIndustry',
        handlers: [datamanager.perfectIndustryView]
    },{
        method: 'Post',
        route: '/industrySystermAdd',
        handlers: [datamanager.industrySystermCreate]
    },{
        method: 'Post',
        route: '/industryView',
        handlers: [datamanager.industryViewList]
    },{
        method: 'Post',
        route: '/projectList',
        handlers: [datamanager.projectList]
    },{
        method: 'Post',
        route: '/projectDetails',
        handlers: [datamanager.projectDetails]
    },{
        method: 'Post',
        route: '/choiceFeatureLibrary',
        handlers: [datamanager.choiceFeatureLibrary]
    },{
        method: 'Post',
        route: '/getIndustryBytype',
        handlers: [datamanager.getIndustryBytype]
    },{
        method: 'Post',
        route: '/createCase',
        handlers: [datamanager.createCase]
    }, {
        method: 'Post',
        route: '/createYamlFile',
        handlers: [datamanager.createYamlFile]
    }, {
        method: 'Post',
        route: '/exportYamlFile',
        handlers: [datamanager.exportYamlFile]
    },{
        method: 'Post',
        route: '/featureLibraryCreate',
        handlers: [datamanager.featureLibraryAdd]
    },{
        method: 'Post',
        route: '/featureLibrarySubmit',
        handlers: [datamanager.featureLibrarySubmit]
    },{
        method: 'Post',
        route: '/selectCase',
        handlers: [datamanager.selectCase]
    },{
        method: 'Post',
        route: '/businessSubmission',
        handlers: [datamanager.businessSubmission]
    },{
        method: 'Post',
        route: '/featureLibraryDel',
        handlers: [datamanager.featureLibraryDel]
    }
]