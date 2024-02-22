const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')
const Jadwalharian = require('./jadwalharianModel.js')
const Users = require('./userModel.js')

const { DataTypes } = Sequelize

const Absen = dbClient.define('absen', {
    id_absensi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_jadhar: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
})

Absen.belongsTo(Jadwalharian, { foreignKey: 'id_jadhar' })
Absen.belongsTo(Users,{foreignKey: 'id_user' } )

module.exports = Absen