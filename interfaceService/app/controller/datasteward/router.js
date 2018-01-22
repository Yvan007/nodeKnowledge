/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as datasteward from './controller'

export const baseUrl = '/datasteward'


export default [{
	    method: 'POST',
	    route: '/list',
	    handlers: [datasteward.projectList]
	},{
        method: 'POST',
        route: '/projectDetails',
        handlers: [datasteward.projectDetails]
    },{
        method: 'POST',
        route: '/selectFeatureLibrary',
        handlers: [datasteward.selectFeatureLibrary]
    },{
        method: 'POST',
        route: '/perfectView',
        handlers: [datasteward.perfectView]
    },{
        method: 'POST',
        route: '/perfectFeatureLibrary',
        handlers: [datasteward.perfectFeatureLibraryAdd]
    },{
        method: 'POST',
        route: '/perfectFeatureLibrarySubmit',
        handlers: [datasteward.perfectFeatureLibrarySubmit]
    },{
        method: 'POST',
        route: '/perfectFeatureLibraryTotalSubmit',
        handlers: [datasteward.perfectFeatureLibraryTotalSubmit]
    }
]