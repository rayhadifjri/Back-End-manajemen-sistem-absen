const { Sequelize } = require('sequelize')
const dbClient = require('../database/config.js')
const Level = require('./levelModel.js')

const { DataTypes } = Sequelize

const Users = dbClient.define('users', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    foto_user: DataTypes.TEXT,
    email: DataTypes.STRING,
    id_level: DataTypes.INTEGER,
    no_personel: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
},{
    freezeTableName: true
}
)

Users.belongsTo(Level, {foreignKey: 'id_level'})

module.exports = Users