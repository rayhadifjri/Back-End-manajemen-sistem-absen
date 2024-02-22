const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')
const Fakultas = require('./fakultasModel.js')

const { DataTypes } = Sequelize

const Prodi = dbClient.define('prodi', {
    id_prodi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_prodi: DataTypes.STRING,
    id_fakultas: DataTypes.INTEGER
},{
    freezeTableName: true
})

Prodi.belongsTo(Fakultas, {foreignKey: 'id_fakultas'})

module.exports = Prodi