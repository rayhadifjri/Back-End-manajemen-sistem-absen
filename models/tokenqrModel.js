const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Ijinkhusus = require('./ijinkhususModel.js')


const { DataTypes } = Sequelize

const Tokenqr = dbClient.define('tokenqr',{  
    id_tokenqr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_ijinkhusus: DataTypes.INTEGER,
    token: DataTypes.STRING
},{
    freezeTableName: true
})

Tokenqr.belongsTo(Ijinkhusus, { foreignKey: 'id_ijinkhusus' })

module.exports = Tokenqr