const {Sequelize} = require('sequelize')
const dbClient = require('../database/config.js')
const Ketangkatan = require('./ketangkatanModel.js')
const Users = require('./userModel.js')
const Prodi = require('./prodiModel.js')

const { DataTypes } = Sequelize

const Angkatan = dbClient.define('angkatan', {
    id_angkatan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    id_ketangkatan: DataTypes.INTEGER,
    id_prodi: DataTypes.INTEGER,
},{
    freezeTableName: true
}
)

Angkatan.belongsTo(Users,{foreignKey: 'id_user' } )
Angkatan.belongsTo(Prodi,{foreignKey: 'id_prodi' } )
Angkatan.belongsTo(Ketangkatan,{foreignKey: 'id_ketangkatan' } )

module.exports = Angkatan