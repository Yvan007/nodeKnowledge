const Sequelize = require('sequelize');


import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

const BusinessModle = sequelize.define('k_business_modle', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    industry_info: { type: Sequelize.TEXT, allowNull: false,defaultValue:"",comment:"体系ID和名称（json）" },
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建时间" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建人" },
    weight: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"分值" },
    status:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:1,comment:"1已创建 2已分配 3已完成"},
    to_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"所属用户" },
    project_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"项目ID" },
    distribution_time: { type: Sequelize.INTEGER(11), allowNull: true,comment:"分配执行时间" }
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_business_modle",
    timestamps:false,
});

export default BusinessModle;