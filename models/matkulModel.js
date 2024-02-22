const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Matkul = dbClient.define('matkul',{
    id_matkul: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_matkul: DataTypes.STRING,
},{
    freezeTableName: true
})

module.exports = Matkul