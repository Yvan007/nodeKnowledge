const Sequelize = require('sequelize');


import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

const Channel_systerm = sequelize.define('k_data_channel', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    pid:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:0,comment:"父级ID"},
    sysname: { type: Sequelize.STRING(60), allowNull: false,defaultValue:"",comment:"渠道名称" },
    topid:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:0,comment:"顶级编码"},
    level:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:0,comment:"层级"},
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建时间" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建人" },
    type_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"渠道名称类型" },
    count_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"记录层级结构的ID 不能用主键ID" },
    is_parent: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"是否为父亲节点 0否 1是" },
    update_time:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:0,comment:"修改时间"}
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_data_channel",
    timestamps:false,
});

export default Channel_systerm;