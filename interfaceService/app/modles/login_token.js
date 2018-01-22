/**
 * Created by zhaojinsheng at 2017/12/28 下午7:30
 *
 * Desc :
 */
const Sequelize = require('sequelize');


import sequelize from './db';

const LoginToken = sequelize.define('k_relation_tables', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    token: { type: Sequelize.STRING(255), allowNull: false,defaultValue:"",comment:"项目ID" },
    status: { type: Sequelize.INTEGER(4), allowNull: true,defaultValue:1,comment:"模式类型ID" },

}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_login_token",
    timestamps:false,
});

export default LoginToken;