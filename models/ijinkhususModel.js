const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Users = require('./userModel.js');
const Ketijin = require('./ketijinModel.js');
const MasterStatusIjin = require('./master_status_ijinModel.js');

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
    id_status: DataTypes.INTEGER
}, {
    timestamps: false // Menonaktifkan pembuatan otomatis kolom 'createdAt' dan 'updatedAt'
})

Ijinkhusus.belongsTo(Users, { foreignKey: 'id_user' })
Ijinkhusus.belongsTo(Ketijin, { foreignKey: 'id_ketijin' })
Ijinkhusus.belongsTo(MasterStatusIjin, { foreignKey: 'id_status' })

module.exports = Ijinkhusus