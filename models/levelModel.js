const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Level = dbClient.define('level', {
    id_level: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_level: DataTypes.STRING
},{
    freezeTableName: true
})

module.exports = Level