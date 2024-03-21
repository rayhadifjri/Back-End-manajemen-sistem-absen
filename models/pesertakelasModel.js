const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Users = require('./userModel.js')
const Matkulperiode = require('./matkulperiodeModel.js')
const Prodi = require('./prodiModel.js')

const { DataTypes } = Sequelize

const Pesertakelas = dbClient.define('pesertakelas', {
    id_peskel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_matperiode: DataTypes.INTEGER,
    id_prodi: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
}, {
    freezeTableName: true
})

Pesertakelas.belongsTo(Users,{foreignKey: 'id_user' } )
Pesertakelas.belongsTo(Matkulperiode, { foreignKey: 'id_matperiode' })
Pesertakelas.belongsTo(Prodi, { foreignKey: 'id_prodi' })

module.exports = Pesertakelas