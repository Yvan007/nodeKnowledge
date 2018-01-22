/**
 * Created by zhaojinsheng at 2018/1/2 下午2:53
 *
 * Desc :
 */
const Sequelize = require('sequelize');


import sequelize from './db';

const adminRoles = sequelize.define('k_admin_roles', {
    id: { type: Sequelize.INTEGER(11), autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(50), allowNull: false,defaultValue:"",comment:"角色名称" },
    sort: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"排序" },
    status: { type: Sequelize.INTEGER(1), allowNull: false,defaultValue:0,comment:"状态" },
    isdelete: { type: Sequelize.INTEGER(1), allowNull: false,defaultValue:0,comment:"是否删除" },
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"创建时间" },
    update_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"更新时间" },
    pri_ids: { type: Sequelize.STRING(255), allowNull: false,defaultValue:"",comment:"角色拥有的权限" },
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_admin_roles",
    timestamps:false,
});

export default adminRoles;
