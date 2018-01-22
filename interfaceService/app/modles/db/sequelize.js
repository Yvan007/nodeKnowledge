import Sequelize from 'sequelize'

import config from '../../../config'

const DB = config.dbconfig
export default new Sequelize(DB.database, DB.username, DB.password, {
  host   : DB.host,
  port   : DB.port,
  dialect: config.db_type,

  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_520_ci',
    bigNumberStrings : true,
    supportBigNumbers: true
  },

  pool: {
    max : 50,
    min : 2,
    idle: 10000
  },
})