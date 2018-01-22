/**
 * Created by zhaojinsheng at 2017/12/3 下午6:21
 *
 * Desc :
 */
const Sequelize = require('sequelize');

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { DB_RESTART_FLAG } from '../config/config'
import sequelize from './db';

//校验密码
function validatePassword(password) {
    const adminUser = this;

    //两个参数都是异步回调函数
    return new Promise((resolve, reject) => {

        bcrypt.compare(password, adminUser.password, (err, isMatch) => {
            if (err) {
                return reject(err); //失败的时候回调
            }

            resolve(isMatch);//成功的时候回调，调用及执行
        })
    })
}

//生成Token
function generateToken() {
    const adminUser = this;

    return jwt.sign({ id: adminUser.id }, config.token,{expiresIn: 60*60*24});
}

const AdminUser = sequelize.define("AdminUser",{
    id:{ type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username:{type:Sequelize.STRING(16),allownull:false,defaultValue:"",comment:"用户名"},
    password:{type:Sequelize.STRING(255),allownull:false,defaultValue:"",comment:"密码"},
    salt:{type:Sequelize.STRING(50),allownull:false,defaultValue:"",comment:"秘钥"},
    email:{type:Sequelize.STRING(255),allownull:false,defaultValue:"",comment:"用户邮箱"},
    mobile:{type:Sequelize.STRING(15),allownull:false,defaultValue:"",comment:"用户手机"},
    sex:{type:Sequelize.INTEGER,allownull:false,defaultValue:1,comment:"性别（1-男，2-女)"},
    role_id:{type:Sequelize.INTEGER,allownull:false,defaultValue:2,comment:"角色id"},
    reg_ip:{type:Sequelize.STRING(20),allownull:true,comment:"添加人ip"},
    reg_time:{type:Sequelize.INTEGER(11),allownull:true,comment:"注册时间"},
    reg_user:{type:Sequelize.INTEGER,allownull:false,defaultValue:0,comment:"注册人"},
    last_login_ip:{type:Sequelize.STRING(20),allownull:true,comment:"最后登录ip"},
    last_login_time:{type:Sequelize.INTEGER(11),allownull:true,comment:"最后登录时间"},
    status:{type:Sequelize.INTEGER,allownull:false,defaultValue:0,comment:"用户状态 1为开启 0禁用"},
    qq:{type:Sequelize.STRING(50),allownull:false,defaultValue:"",comment:"qq"},
},{
    //定义索引
    indexes:[
        {name: 'username', method: 'BTREE', fields: ['username']},
        {name: 'role_id', method: 'BTREE', fields: ['role_id']},
        {name: 'reg_time', method: 'BTREE', fields: ['reg_time']},
        {name: 'reg_user', method: 'BTREE', fields: ['reg_user']},
    ],
    //自定义表的名称
    freezeTableName: true,
    tableName:"k_admin_users",
    timestamps:false,
    //实例方法
    instanceMethods: {
        generateToken: generateToken,
        validatePassword: validatePassword,

    },
    classMethods: {
        getUserByEmail: getUserByEmail,
        getUserByMobile: getUserByMobile,
        getUserByUserName:getUserByUserName
    },

    //回调函数
    hooks: {
        beforeUpdate: function(admin) {
            if (admin._changed.password || admin._changed.username) {
                const salt = bcrypt.genSaltSync(10);
                const p = bcrypt.hashSync(admin.password, salt);
                admin.password = p;
            }
        },
        beforeCreate: function(admin) {
            const salt = bcrypt.genSaltSync(10);
            const p = bcrypt.hashSync(admin.password, salt);
            admin.password = p;
        },



    },
    charset: 'utf8',
});
async  function getUserByEmail(email){
    return AdminUser.findAll({where:{email:email},attributes:['id']});
}
async  function getUserByMobile(phone){
    return AdminUser.findAll({where:{mobile:phone},attributes:['id']});
}
async function getUserByUserName(name){
    return AdminUser.findAll({where:{username:name},attributes:['id']});
}
// AdminUser.sync({ force: false });
export default AdminUser;
