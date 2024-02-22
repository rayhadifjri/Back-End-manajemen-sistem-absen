const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Ketangkatan = dbClient.define('ketangkatan', {
    id_ketangkatan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_angkatan: DataTypes.STRING
},{
    freezeTableName: true
})

module.exports = Ketangkatan