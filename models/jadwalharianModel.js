const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Matkulperiode = require('./matkulperiodeModel.js')
const Users = require('./userModel.js')

const { DataTypes } = Sequelize

const Jadwalharian = dbClient.define('jadwalharian',{
    id_jadhar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_matperiode: DataTypes.INTEGER,
    id_user: DataTypes.ARRAY(DataTypes.INTEGER), // Menggunakan ARRAY untuk kumpulan integer
    pertemuan_ke: DataTypes.INTEGER,
})

Jadwalharian.belongsTo(Users,{ foreignKey: 'id_user' })
Jadwalharian.belongsTo(Matkulperiode,{ foreignKey: 'id_matperiode' })

module.exports = Jadwalharian