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
                attributes: ['id_user', 'username', 'email', 'id_level']
            }
        );
        return users;
    } catch (error) {
        return null;
    }
}

const getijinbyidketijin = async (id_ketijin) => {
    try {
        const ijin = await Ijinkhusus.findAll(
            {
                attributes: ['id_ijinkhusus' ,'deskripsi', 'files', 'status_ijin'],
                where: {
                    id_ketijin
                },
                include: [{
                    model: Users, // Tabel users
                    attributes: ['username'] // Hanya pilih kolom username dari tabel users
                }]
            }
        )
        return ijin;
    } catch (error) {
        throw error;
    }
}

const deleteijin = async (id_ijinkhusus) => {
    try {
        const rejected = await Ijinkhusus.findOne({
            where: {
                id_ijinkhusus
            }
        });
        if (rejected) {
            const result = await Ijinkhusus.update({
                status_ijin : 0
            }, {
                where: {
                    id_ijinkhusus
                }
            });
            return result
        }else {
            throw new Error("Ijin sakit tidak ditemukan");
        }
    } catch (error) {
        throw error;
    }
}

const approvedIjinSakit = async (id_ijinkhusus, status_ijin) => {
    try {
        const approve = await Ijinkhusus.findOne({
            where: {
                id_ijinkhusus
            }
        });
        if (approve) {
            const result = await Ijinkhusus.update({
                status_ijin : 5
            }, {
                where: {
                    id_ijinkhusus
                }
            });
            return result
        }else {
            throw new Error("Ijin sakit tidak ditemukan");
        }
    } catch (error) {
        throw error
    }
}

const getUserbyId = async (id_user) => {
    try {
        const user = await Users.findOne({
            attributes: ['id_user', 'username', 'email', 'id_level'],
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
            attributes: ['id_user', 'username', 'email', 'id_level'],
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
    try {
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
        else {
            return "Gagal Update User";
        }
    } catch (error) {
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
        else {
            return "Gagal Delete User";
        }
    } catch (error) {
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

const ijinSakit = async (id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, status_ijin) => {
    try {
        // Lakukan operasi yang sesuai di sini, misalnya menyimpan data ke database atau melakukan validasi lainnya.
        // Pastikan id_ketijin tidak null dan lakukan operasi yang diperlukan.
        const user = await Users.findOne({
            where: {
                id_user
            }
        })

        // Contoh operasi: menyimpan data ke database
        if (user) {
            const result = await Ijinkhusus.create({
                id_user,
                id_ketijin,
                tanggal_mulai,
                files,
                tanggal_selesai,
                deskripsi,
                status_ijin
            });
            return result;
        } else {
            throw new Error("User tidak ditemukan");
        }
    } catch (error) {
        throw new Error("Gagal melakukan absensi sakit: " + error.message);
    }
}

const dinasLuar = async (id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, status_ijin) => {
    try {
        const user = await Users.findOne({
            where: {
                id_user
            }
        })
        if (user) {
            const result = await Ijinkhusus.create({
                id_user,
                id_ketijin,
                tanggal_mulai,
                files,
                tanggal_selesai,
                deskripsi,
                status_ijin
            });
            return result;
        } else {
            throw new Error("User tidak ditemukan");
        }
    } catch (error) {
        throw new Error("Gagal mengajukan absensi dinas luar: " + error.message);
    }
}

const pengajuanCuti = async (id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, status_ijin) => {
    try {
        const user = await Users.findOne({
            id_user
        })
        if (user) {
            const result = await Ijinkhusus.create({
                id_user,
                id_ketijin,
                tanggal_mulai,
                files,
                tanggal_selesai,
                deskripsi,
                status_ijin
            });
            return result;
        } else {
            throw new Error("User tidak ditemukan");
        }
    } catch (error) {
        throw new Error("Gagal mengajukan cuti: " + error.message)
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
    ijinSakit,
    dinasLuar,
    pengajuanCuti,
    getijinbyidketijin,
    deleteijin,
    approvedIjinSakit
}