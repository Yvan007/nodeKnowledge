const Sequelize = require('sequelize');


import sequelize from './db';

const Project = sequelize.define('k_project', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    pro_name: { type: Sequelize.STRING(50), allowNull: false,defaultValue:"",comment:"项目名称" },
    desc: { type: Sequelize.STRING(200), allowNull: false,defaultValue:"",comment:"描述" },
    create_time: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建时间" },
    create_user: { type: Sequelize.INTEGER(11), allowNull: false,defaultValue:"",comment:"创建人" },
    status: { type: Sequelize.INTEGER(11),defaultValue:1,comment:"1已创建 2业务模式已创建 3业务模式分配已提交 4选择特征库已提交 5业务模式总提交 6特征库分配已提交 7特征库详单提交 8特征库总提交已完成" }
}, {
    charset: 'utf8',
    freezeTableName: true,
    tableName:"k_project",
    timestamps:false,
    classMethods: {
        //项目数据
        getProject: async function(project_id){
            return Project.findOne({ where: { id: project_id } });
        }
    },
});
//Project.sync({ force: DB_RESTART_FLAG }).then(() => {});

export default Project;