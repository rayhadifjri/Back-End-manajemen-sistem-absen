const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Matkul = require('./matkulModel.js')
const Periode = require('./periodeModel.js')

const { DataTypes } = Sequelize

const Matkulperiode = dbClient.define('matkulperiode',{
    id_matperiode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_matkul: DataTypes.INTEGER,
    id_periode: DataTypes.INTEGER
}, {
    freezeTableName: true
})

Matkulperiode.belongsTo(Matkul,{ foreignKey: 'id_matkul' })
Matkulperiode.belongsTo(Periode,{ foreignKey: 'id_periode' })

module.exports = Matkulperiode