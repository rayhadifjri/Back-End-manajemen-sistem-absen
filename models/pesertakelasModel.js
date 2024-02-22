const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Users = require('./userModel.js')
const Periode = require('./periodeModel.js')

const { DataTypes } = Sequelize

const Pesertakelas = dbClient.define('pesertakelas', {
    id_peskel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_periode: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
}, {
    freezeTableName: true
})

Pesertakelas.belongsTo(Users,{foreignKey: 'id_user' } )
Pesertakelas.belongsTo(Periode, { foreignKey: 'id_periode' })

module.exports = Pesertakelas