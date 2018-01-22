/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as industry from './controller'

export const baseUrl = '/industry'


export default [{
	    method: 'POST',
	    route: '/list',
	    handlers: [industry.industryList]
	},{
        method: 'POST',
        route: '/add',
        handlers: [industry.createIndustryType]
    },{
        method: 'POST',
        route: '/save',
        handlers: [industry.getIndustryTypeData, industry.updateIndustryType]
    },{
        method: 'POST',
        route: '/industryView',
        handlers: [industry.industryViewList]
    },{
        method: 'POST',
        route: '/perfectView',
        handlers: [industry.perfectIndustryView]
    },{
        method: 'POST',
        route: '/industryCreat',
        handlers: [industry.industryAdd]
    },{
        method: 'POST',
        route: '/delete',
        handlers: [industry.industrySystermDel]
    },{
        method: 'POST',
        route: '/systermSave',
        handlers: [industry.industrySystermSave]
    },{
        method: 'POST',
        route: '/industryTemporaryAdd',
        handlers: [industry.industryTemporaryAdd]
    }
]