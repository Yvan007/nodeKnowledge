const Sequelize = require('sequelize');


import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

const Channel_type = sequelize.define('k_channel_type', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    type_name: { type: Sequelize.STRING(60), allowNull: false,defaultValue:"",comment:"渠道类型名称" },
    desc: { type: Sequelize.STRING(200), allowNull: false,defaultValue:"",comment:"渠道描述" },
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建时间" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建人" },
    status:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:1,comment:"渠道类型状态 1第一批次 2第二批次 3第三批次"}
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_channel_type",
    timestamps:false,
});

export default Channel_type;