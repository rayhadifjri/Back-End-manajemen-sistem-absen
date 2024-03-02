const { dbQuery } = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { Result } = require("express-validator");
const Users = require("../models/userModel.js");
const { Op } = require('sequelize');
const Ijinkhusus = require('../models/ijinkhususModel.js');


// Create a new user, get user, and edit user

const getUsers = async () => {
    try {
        const users = await Users.findAll(
            {
                attributes: ['id_user','username', 'email', 'id_level']
            }
        );
        return users;
    } catch (error) {
        return null;
    }
}

const getUserbyId = async (id_user) => {
    try {
        const user = await Users.findOne({
            attributes: ['id_user','username', 'email', 'id_level'],
            where: {
                id_user
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}

// const getUsersbyProdi = async (id_prodi) => {
//     try {
//         const user = await Users.findAll({
//             attributes: ['id_user','username', 'email', 'id_prodi'],
//             where: {
//                 id_prodi: id_prodi
//             }
//         });
//         return user;
//     } catch (error) {
//         return null;
//     }
// }

const getUsersByPartialUsername = async (partialUsername) => {
    try {
        const users = await Users.findAll({
            attributes: ['id_user','username', 'email', 'id_level'],
            where: {
                username: {
                    [Op.iLike]: '%' + partialUsername + '%' // Use the iLike operator for case-insensitive search
                }
            }
        });
        return users;
    } catch (error) {
        throw error;
    }
};

const register = async (username, password, email, no_personel, id_level) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            username,
            password: hash,
            email,
            no_personel,
            id_level
        })
        return "Berhasil Register";
    } catch (error) {
        console.log(error);
        throw error; // You might want to throw the error so it can be handled by the caller
    }
};

const editUser = async (id_user, username, password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try{
        const user = await Users.findOne({
            where: {
                id_user
            }
        });
        if (user) {
            await Users.update({ 
                username,
                password: hash
            }, {
                where: { 
                    id_user
                }
            });
            return "Berhasil Update User";
        }
        else{
            return "Gagal Update User";
        }
    }catch (error) {
        console.error(error);
        return null;
    }
};

const deleteUser = async (id_user) => {
    try {
        const user = await Users.findOne({
            where: {
                id_user
            }
        });
        if (user) {
            await Users.destroy({
                where: {
                    id_user
                }
            });
            return "Berhasil Delete User";
        }
        else{
            return "Gagal Delete User";
        }
    }catch (error) {
        console.error(error);
        return null;
    }
};

const login = async (username, password) => {
    try {
        const user = await Users.findOne({
            where: {
                username
            }
        });
        if (!user) {
            return null;
        }
        const compares = await bcrypt.compare(password, user.password);
        if (!compares) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};

const logout = async (refreshToken, res) => {
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return console.log("User tidak ditemukan");
    const username = user[0].username;
    await Users.update({ refresh_token: null }, {
        where: { 
            username 
        }
    });
}

const ijinSakit = async (id_user, id_ketijin, tanggal_mulai, tanggal_selesai, files, deskripsi, status_ijin) => {
    try {
        // Cari pengguna berdasarkan id_user
        const user = await Users.findOne({
            where: {
                id_user: id_user
            }
        });

        // Periksa apakah pengguna ditemukan
        if (!user) {
            throw new Error("Pengguna tidak ditemukan");
        }

        // Tambahkan data absensi sakit ke dalam database
        const ijinSakitData = await Ijinkhusus.create({
            id_user: id_user,
            id_ketijin: id_ketijin,
            tanggal_mulai: tanggal_mulai,
            tanggal_selesai: tanggal_selesai,
            files: files.path,
            deskripsi: deskripsi,
            status_ijin: status_ijin
        });

        return ijinSakitData;
    } catch (error) {
        throw new Error("Gagal melakukan absensi sakit: " + error.message);
    }
}

module.exports = {
    editUser,
    getUserbyId,
    getUsersByPartialUsername,
    deleteUser,
    register,
    getUsers,
    logout,
    login,
    ijinSakit
}