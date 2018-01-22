/**
 * Created by zhaojinsheng at 2017/12/22 下午2:40
 *
 * Desc :
 */
const Sequelize = require('sequelize');

import sequelize from './db';

const Character_case = sequelize.define('k_character_case', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    case_info: { type: Sequelize.TEXT, allowNull: false,defaultValue:"",comment:"实例信息" },
    modle_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"模式id" },
    project_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"项目id" },
    fenzhi: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"分值" },
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_character_case",
    timestamps:false,
});

export default Character_case;