/**
 * Created by gy at 2017/12/4 下午3:00
 *
 * Desc :
 */
import * as channel from './controller'

export const baseUrl = '/channel'


export default [{
	    method: 'POST',
	    route: '/list',
	    handlers: [channel.channelList]
	},{
        method: 'POST',
        route: '/add',
        handlers: [channel.createChannelType]
    },{
        method: 'POST',
        route: '/save',
        handlers: [channel.getChannelTypeData, channel.updateChannelType]
    },{
        method: 'POST',
        route: '/channelView',
        handlers: [channel.channelViewList]
    },{
        method: 'POST',
        route: '/perfectView',
        handlers: [channel.perfectChannelView]
    },{
        method: 'POST',
        route: '/channelCreat',
        handlers: [channel.channelAdd]
    },{
        method: 'POST',
        route: '/getChannelSysterm',
        handlers: [channel.getChannelSysterm]
    },{
        method: 'POST',
        route: '/channelTemporaryAdd',
        handlers: [channel.channelTemporaryAdd]
    }
]