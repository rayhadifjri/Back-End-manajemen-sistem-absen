const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const { Ijinkhusus } = require('./index.js')

const { DataTypes } = Sequelize

const Statusperijinan = dbClient.define('statusperijinan', {
    id_statusperijinan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_ijinkhusus: DataTypes.INTEGER,
    change: DataTypes.INTEGER,
    changed_by: DataTypes.STRING,
    tanggal: DataTypes.DATE,
}, {
    freezeTableName: true
})

Statusperijinan.belongsTo(Ijinkhusus,{foreignKey: 'id_ijinkhusus' } )

module.exports = Statusperijinan