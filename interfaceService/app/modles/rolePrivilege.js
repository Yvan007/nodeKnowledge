/**
 * Created by zhaojinsheng at 2018/1/2 下午2:53
 *
 * Desc :
 */
const Sequelize = require('sequelize');

import sequelize from './db';

const rolePrivilege = sequelize.define('k_role_privilege', {}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_role_privilege",
    timestamps:false,
});

export default rolePrivilege;
