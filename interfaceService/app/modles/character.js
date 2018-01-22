const Sequelize = require('sequelize');


import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

const Character = sequelize.define('k_character', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    industry_ids: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"体系ID" },
    channel_ids: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"渠道ID" },
    weight: { type: Sequelize.STRING(10), allowNull: false,defaultValue:0,comment:"分值" },
    create_time:{type:Sequelize.INTEGER(11),allownull:false,comment:"创建时间"},
    to_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"所属用户" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"用户ID" },
    status: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:1,comment:"1已创建 2已分配 3已完善" },
    distribution_time: { type: Sequelize.INTEGER(11), allowNull: true,comment:"分配执行时间" }
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_character",
    timestamps:false,
});

export default Character;