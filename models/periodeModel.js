const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Periode = dbClient.define('periode',{
    id_periode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_periode: DataTypes.STRING,
},{
    freezeTableName: true
})

module.exports = Periode