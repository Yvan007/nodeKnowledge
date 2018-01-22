/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as dataadmin from './controller'

export const baseUrl = '/dataadmin'


export default [{
	    method: 'POST',
	    route: '/list',
	    handlers: [dataadmin.industryDistList]
	},{
        method: 'POST',
        route: '/findIndestry',
        handlers: [dataadmin.findIndestryData]
    },{
        method: 'POST',
        route: '/dataManager',
        handlers: [dataadmin.getDataManager]
    },{
        method: 'POST',
        route: '/distribution',
        handlers: [dataadmin.getIndustryTypeData, dataadmin.distributionAdd]
    },{
        method: 'POST',
        route: '/projectList',
        handlers: [dataadmin.projectListData]
    },{
        method: 'POST',
        route: '/distributionPage',
        handlers: [dataadmin.distributionView]
    },{
        method: 'POST',
        route: '/distributionFeatures',
        handlers: [dataadmin.getBusinessModleData, dataadmin.distributionFeaturesAdd]
    },{
        method: 'POST',
        route: '/selectFeatureLibrary',
        handlers: [dataadmin.selectFeatureLibrary]
    },{
        method: 'POST',
        route: '/distributionCharacter',
        handlers: [dataadmin.getCharacterData, dataadmin.distributionCharacterAdd]
    },{
        method: 'POST',
        route: '/businessSubmit',
        handlers: [dataadmin.businessSubmit]
    },{
        method: 'POST',
        route: '/characterSubmit',
        handlers: [dataadmin.characterSubmit]
    }
]