const Sequelize = require('sequelize');


import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

const CharacterMess = sequelize.define('k_character_mess', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    message: { type: Sequelize.STRING(150), allowNull: false,defaultValue:"",comment:"URL" },
    character_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"特征ID" }
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_character_mess",
    timestamps:false,
});

export default CharacterMess;