const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Fakultas = dbClient.define('fakultas', {
    id_fakultas: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_fakultas: DataTypes.STRING
},{
    freezeTableName: true
})

module.exports = Fakultas