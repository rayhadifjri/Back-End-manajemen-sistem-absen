const { dbQuery } = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { Result } = require("express-validator");
const Users = require("../models/userModel.js");
const { Op } = require('sequelize');
const Ijinkhusus = require('../models/ijinkhususModel.js');
const Prodi = require('../models/prodiModel.js');
const { Fakultas, Angkatan } = require("../models/index.js");
const { Ketangkatan } = require("../models/index.js")
const { angkatan } = require("../models/index.js")
const MasterStatusIjin = require("../models/master_status_ijinModel.js");


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
                attributes: ['id_ijinkhusus', 'deskripsi', 'files', 'status_ijin'],
                where: {
                    id_ketijin
                },
                include: [
                    {
                        model: Users, // Tabel users
                        attributes: ['username'] // Hanya pilih kolom username dari tabel users
                    },
                    {
                        model: MasterStatusIjin, // Tabel master_status_ijin
                        attributes: ['desc'] // Hanya pilih kolom desc dari tabel master_status_ijin
                    }
                ],
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
                status_ijin: 0
            }, {
                where: {
                    id_ijinkhusus
                }
            });
            return result
        } else {
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
                status_ijin: 5
            }, {
                where: {
                    id_ijinkhusus
                }
            });
            return result
        } else {
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

const login = async (email, password) => {
    try {
        const user = await Users.findOne({
            where: {
                email
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

const forgetPassword = async (email) => {
    try {
        const user = await Users.findOne({
            where: {
                email
            }
        });
        if (!user) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};

const resetPassword = async (id_user, token, password) => {
    // return new Promise((resolve, reject) => {
    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    //         if (err) {
    //             return reject(new Error("Token tidak valid"));
    //         }
    //         try {
    //             const user = await Users.findOne({
    //                 where: {
    //                     id_user
    //                 }
    //             });
    //             if (!user) {
    //                 return reject(new Error("User tidak ditemukan"));
    //             }
    //             const salt = await bcrypt.genSalt(10);
    //             const hash = await bcrypt.hash(password, salt);
    //             await Users.update({
    //                 password: hash
    //             }, {
    //                 where: {
    //                     id_user
    //                 }
    //             });
    //             resolve(user);
    //         } catch (error) {
    //             console.log(error);
    //             reject(error);
    //         }
    //     });
    // });
}

const logout = async (refreshToken) => {
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

const getApprovedIjinSakit = async (id_ijinkhusus) => {
    try {
        const getIjin = await Ijinkhusus.findOne({
            attributes: ['id_ketijin', 'deskripsi', 'status_ijin'],
            where: {
                id_ijinkhusus
            }
        });
        return getIjin;
    } catch (error) {
        throw new Error("Gagal mendapatkan ijin sakit: " + error.message);
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

const absensiDinasLuar = async (id_user, nama_lokasi, id_matperiode, pertemuan_ke) => {
    try {
        const user = await Users.findOne({
            where: {
                id_user
            }
        });

    } catch (error) {
        throw new Error("Gagal melakukan absensi dinas luar: " + error.message);
    }

}

const getProdi = async () => {
    try {
        const prodi = await Prodi.findAll(
            {
                attributes: ['id_prodi', 'nama_prodi']
            }
        );
        return prodi;
    } catch (error) {
        throw new Error("Gagal mendapatkan prodi: " + error.message)
    }
}

const getFakultas = async () => {
    try {
        const fakultas = await Fakultas.findAll(
            {
                attributes: ['id_fakultas', 'nama_fakultas']
            }
        );
        return fakultas;
    } catch (error) {
        throw new Error("Gagal mendapatkan fakultas: " + error.message)
    }

}

const getKetangkatan = async () => {
    try {
        const ketangkatan = await Ketangkatan.findAll(
            {
                attributes: ['id_ketangkatan', 'nama_angkatan']
            }
        );
        return ketangkatan;
    } catch (error) {
        throw new Error("Gagal mendapatkan ketangkatan: " + error.message)
    }
}

const getAngkatan = async (id_prodi, id_ketangkatan) => {
    try {
        const angkatan = await Angkatan.findAll(
            {
                attributes: ['id_angkatan', 'id_user', 'id_ketangkatan', 'id_prodi'],
                where: {
                    id_prodi,
                    id_ketangkatan
                },
                include: [
                    {
                        model: Users, // Tabel users
                        attributes: ['username', 'email'] // Hanya pilih kolom username dari tabel users
                    },
                    {
                        model: Prodi, // Tabel prodi
                        attributes: ['nama_prodi'] // Hanya pilih kolom nama_prodi dari tabel prodi
                    },
                    {
                        model: Ketangkatan, // Tabel ketangkatan
                        attributes: ['nama_angkatan'] // Hanya pilih kolom nama_angkatan dari tabel ketangkatan
                    }
                ]
            })
        return angkatan
    } catch (error) {
        throw new Error("Gagal mendapatkan angkatan: " + error.message)
    }
}

const getMasterStatusIjin = async (id_level) => {
    try {
        const masterStatusIjin = await MasterStatusIjin.findOne(
            {
                attributes: ['id_status', 'desc', 'id_level', 'id_status_next'],
                where: {
                    id_level: id_level
                },
                order: [
                    ['id_status', 'ASC']
                ]
            }
        );
        return masterStatusIjin;
    } catch (error) {
        throw new Error("Gagal mendapatkan master status ijin: " + error.message)
    }
}

const updateIjin = async (id_ijinkhusus, isApproved, id_level) => {
    try {
        const ijinKhusus = await Ijinkhusus.findOne({
            where: {
                id_ijinkhusus
            }
        });
        const masterStatusIjin = await MasterStatusIjin.findAll({
            where: {
                id_level
            },
            order: [
                ['id_status', 'ASC']
            ]
        });

        const isValid = masterStatusIjin.some((status) => status.id_status === ijinKhusus.status_ijin);

        if (isValid) {
            if(isApproved){
                let result = await Ijinkhusus.update({
                    status_ijin: masterStatusIjin[1].id_status_next
                }, {
                    where: {
                        id_ijinkhusus
                    }
                });
                return result
            }else{
                let result = await Ijinkhusus.update({
                    status_ijin: masterStatusIjin[2].id_status_next
                }, {
                    where: {
                        id_ijinkhusus
                    }
                });
                return result
            }
        } else {
            throw new Error("Ijin sakit tidak ditemukan");
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    editUser,
    getUserbyId,
    getProdi,
    getUsersByPartialUsername,
    getKetangkatan,
    getFakultas,
    getAngkatan,
    deleteUser,
    register,
    getUsers,
    logout,
    login,
    ijinSakit,
    dinasLuar,
    forgetPassword,
    pengajuanCuti,
    getijinbyidketijin,
    deleteijin,
    approvedIjinSakit,
    getApprovedIjinSakit,
    absensiDinasLuar,
    resetPassword,
    getMasterStatusIjin,
    updateIjin
}