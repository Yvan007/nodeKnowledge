const Sequelize = require('sequelize');


import sequelize from './db';

const Industry_type = sequelize.define('k_industry_type', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    type_name: { type: Sequelize.STRING(60), allowNull: false,defaultValue:"",comment:"体系类型名称" },
    desc: { type: Sequelize.STRING(200), allowNull: false,defaultValue:"",comment:"体系描述" },
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:0,comment:"创建时间" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建人" },
    to_user: { type: Sequelize.INTEGER(11), allowNull: true,defaultValue:0,comment:"所属用户" },
    distribution_time: { type: Sequelize.INTEGER(11), allowNull: true,comment:"分配执行时间" },
    status:{type:Sequelize.INTEGER(11),allownull:false,defaultValue:1,comment:"体系类型状态 未完善 1   专家已提交 2  已分配 3  已完善 4 "}
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_industry_type",
    timestamps:false,
    classMethods: {
        //体系数据
        getIndustryType: async function(){
            return Industry_type.findAll({ where: { status: 4 }, order : [['create_time', 'DESC']] });
        }
    },
});

export default Industry_type;