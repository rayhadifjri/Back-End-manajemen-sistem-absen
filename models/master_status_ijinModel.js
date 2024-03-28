const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const level = require('./levelModel.js')

const { DataTypes } = Sequelize

// Import required modules

const MasterStatusIjin = dbClient.define('master_status_ijin',{
    id_status: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    desc: DataTypes.STRING,
    id_level: DataTypes.INTEGER,
    id_status_next: DataTypes.INTEGER
}, {
    freezeTableName: true
})

MasterStatusIjin.belongsTo(level,{ foreignKey: 'id_level' })

// Create and export the master_status_ijin model
module.exports = MasterStatusIjin