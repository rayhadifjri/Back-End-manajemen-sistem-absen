const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Absen = require('./absenModel.js')

const { DataTypes } = Sequelize

const Lokasi = dbClient.define('lokasi',{
    id_lokasi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_absensi: DataTypes.INTEGER,
    nama_lokasi: DataTypes.STRING
}, {
    freezeTableName: true
})

Lokasi.belongsTo(Absen, { foreignKey: 'id_absensi' })

module.exports = Lokasi