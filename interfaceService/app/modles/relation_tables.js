const Sequelize = require('sequelize');


import sequelize from './db';

const RelationTables = sequelize.define('k_relation_tables', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    project_id: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"项目ID" },
    business_id: { type: Sequelize.INTEGER(11), allowNull: true,comment:"模式类型ID" },
    charact_id: { type: Sequelize.STRING(255), allowNull: true,comment:"特征库ID" }
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_relation_tables",
    timestamps:false,
});

export default RelationTables;