const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')

const { DataTypes } = Sequelize

const Ketijin = dbClient.define('ketijin', {
    id_ketijin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_ijin: DataTypes.STRING
}, {
    tableName: 'ketijin' // Menentukan nama tabel yang tepat
})

module.exports = Ketijin