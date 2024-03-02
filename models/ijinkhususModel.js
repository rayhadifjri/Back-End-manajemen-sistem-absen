const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Users = require('./userModel.js');
const Ketijin = require('./ketijinModel.js');

const { DataTypes } = Sequelize

const Ijinkhusus = dbClient.define('ijinkhusus',{   
    id_ijinkhusus: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    id_ketijin: DataTypes.INTEGER,
    tanggal_mulai: DataTypes.DATE,
    tanggal_selesai: DataTypes.DATE,
    files: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    status_ijin: DataTypes.INTEGER
}, {
    freezeTableName: true,
    timestamps: false // Tambahkan opsi timestamps di sini
})

Ijinkhusus.belongsTo(Users, { foreignKey: 'id_user' })
Ijinkhusus.belongsTo(Ketijin, { foreignKey: 'id_ketijin' })

module.exports = Ijinkhusus