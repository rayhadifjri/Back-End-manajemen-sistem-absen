const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Ketijin = dbClient.define('ketijin', {
    id_ketijin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_ketijin: DataTypes.STRING
})

module.exports = Ketijin