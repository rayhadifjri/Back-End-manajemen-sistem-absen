const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Ijinkhusus = require('./ijinkhususModel.js')


const { DataTypes } = Sequelize

const Fileperijinan = dbClient.define('fileperijinan', {
    id_fileperijinan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_ijinkhusus: DataTypes.INTEGER,
    files: DataTypes.STRING
})

Fileperijinan.belongsTo(Ijinkhusus, { foreignKey: 'id_ijinkhusus' })

module.exports = Fileperijinan