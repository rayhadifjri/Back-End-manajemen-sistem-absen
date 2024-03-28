const express = require('express');
const { Services } = require("../services");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel.js");
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

// user

const getUsers = async (req, res) => {
    try {
        const hasil = await Services.getUsers();
        res.json(hasil);
    } catch (error) {
        console.log(error);
    }
}

const getUserbyId = async (req, res) => {
    const { id_user } = req.params
    try {
        const hasil = await Services.getUserbyId(id_user);
        if (!hasil) {
            res.status(404).send("User tidak ditemukan");
        }
        res.send(hasil);
    } catch (error) {
        console.log(error);
    }
}

// const getUsersbyProdi = async (req, res) => {
//     const {id_prodi} = req.params
//     try {
//         const hasil = await Services.getUsersbyProdi(id_prodi);
//         if (!hasil) {
//             res.status(404).send("User tidak ditemukan");
//         }
//         res.send(hasil);
//     } catch (error) {
//         console.log(error);
//     }
// }

const register = async (req, res) => {
    const { username, password, email, no_personel, id_level } = req.body;
    try {
        var result = await Services.register(username, password, email, no_personel, id_level);
        if (!result) {
            throw new Error(msg = "Gagal Register");
        }
        res.send(result);
    } catch (error) {
        res.send(error.message)
        console.log(error);
    }
};

const editUser = async (req, res) => {
    const { id_user } = req.params
    const { username, password } = req.body;
    try {
        var result = await Services.editUser(id_user, username, password);
        if (!result) {
            throw new Error("Gagal Update User");
        }
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const getijinbyidketijin = async (req, res) => {
    const { id_ketijin } = req.params
    try {
        const result = await Services.getijinbyidketijin(id_ketijin);
        if (!result) {
            res.status(404).send("Ijin tidak ditemukan");
        }
        res.send(result);
    } catch (error) {
        console.log(error);
    }
}

const deleteijin = async (req, res) => {
    const { id_ijinkhusus } = req.params
    const { id_status } = req.body
    try {
        var result = await Services.deleteijin(id_ijinkhusus, id_status);
        if (!result) {
            throw new Error("Gagal Delete Ijin");
        }
        res.send(result)
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const approvedIjinSakit = async (req, res) => {
    const { id_ijinkhusus } = req.params
    const { id_status } = req.body
    try {
        var result = await Services.approvedIjinSakit(id_ijinkhusus, id_status);
        if (!result) {
            throw new Error("Gagal approve sakit")
        }
        res.send(result)
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const getApprovedIjinSakit = async (req, res) => {
    const { id_ijinkhusus } = req.params
    try {
        var result = await Services.getApprovedIjinSakit(id_ijinkhusus);
        if (!result) {
            throw new Error("Gagal Menampilkan approve sakit")
        }
        res.send(result)
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const getUsersByPartialUsername = async (req, res) => {
    try {
        const partialUsername = req.params.partialUsername;
        const users = await Services.getUsersByPartialUsername(partialUsername);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id_user } = req.params
    try {
        var result = await Services.deleteUser(id_user);
        if (!result) {
            throw new Error("Gagal Delete User");
        }
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

// Login and logout

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hasil = await Services.login(email, password);
        if (!hasil) {
            throw new Error("email atau Password Salah");
        } else {
            const username = hasil.username;
            const id_level = hasil.id_level;
            const accessToken = jwt.sign({ email, username, password, id_level }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ email, username, password, id_level }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

            await Users.update({ refresh_token: refreshToken }, {
                where: { username: username }
            });

            res.cookie(
                "refreshToken",
                refreshToken,
                {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                }
            );

            res.status(200).json({ accessToken });
        }
    } catch (error) {
        res.status(400).json({ msg: "User tidak ditemukan" });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const hasil = await Services.forgetPassword(email);
        if (!hasil) {
            throw new Error("user tidak ditemukan");
        } else {
            const id_user = hasil.id_user;
            // const username = hasil.username;
            // const password = hasil.password;
            const token = jwt.sign({ id_user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'regimentcadet@gmail.com',
                    pass: 'hyxn pabt olyi gdqc'
                }
            });

            var mailOptions = {
                from: 'regimentcadet@gmail.com',
                to: email,
                subject: 'Reset Your Password',
                text: `http://localhost:3000/reset-password/${id_user}/${token}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    return res.send({ status: "Success" });
                }
            });
        }
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const resetPassword = async (req, res) => {
    const { id_user, token } = req.params;
    const { password } = req.body;
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden - Token is not valid" });
            }
            const hasil = await Services.resetPassword(id_user, password);
            if (!hasil) {
                throw new Error("Gagal reset password");
            }
            res.send(hasil);
        })
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
}

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        // await Services.logout(refreshToken);
        if (refreshToken) {
            await Services.logout(refreshToken);
        } else {
            return res.sendStatus(204);
        }
        res.clearCookie("refreshToken");
        return res.send("Berhasil Logout");
    } catch (error) {
        console.log(error);
    }
}

const listPengajuanIzin = async (req, res) => {
    try {
        const result = await Services.listPengajuanIzin();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const hapusPengajuanIzin = async (req, res) => {
    const { id_ijinkhusus } = req.params;
    try {
        const result = await Services.hapusPengajuanIzin(id_ijinkhusus);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getLevel = async (req, res) => {
    try {
        const result = await Services.getLevel();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const pengajuanIzin = async (req, res) => {
    const { id_user } = req.params;
    try {
        const result = await Services.pengajuanIzin(id_user);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const ketijin = async (req, res) => {
    try {
        const result = await Services.ketijin();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const ijinSakit = async (req, res) => {
    const { id_user } = req.params;
    const { id_ketijin, tanggal_mulai, tanggal_selesai, deskripsi, id_status } = req.body;

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const files = req.file.originalname;

    try {
        const result = await Services.ijinSakit(id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, id_status);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const dinasLuar = async (req, res) => {
    const { id_user } = req.params;
    const { id_ketijin, tanggal_mulai, tanggal_selesai, deskripsi, id_status } = req.body;

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const files = req.file.originalname;

    try {
        const result = await Services.dinasLuar(id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, id_status);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const pengajuanCuti = async (req, res) => {
    const { id_user } = req.params;
    const { id_ketijin, tanggal_mulai, tanggal_selesai, deskripsi, id_status } = req.body;

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const files = req.file.originalname;

    try {
        const result = await Services.pengajuanCuti(id_user, id_ketijin, tanggal_mulai, files, tanggal_selesai, deskripsi, id_status);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const absensiDinasLuar = async (req, res) => {
    const { id_user } = req.params;
    const { nama_lokasi, id_matperiode, pertemuan_ke } = req.body;
    try {
        const result = await Services.absensiDinasLuar(id_user, nama_lokasi, id_matperiode, pertemuan_ke);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getProdi = async (req, res) => {
    try {
        const result = await Services.getProdi();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFakultas = async (req, res) => {
    try {
        const result = await Services.getFakultas();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getKetangkatan = async (req, res) => {
    try {
        const result = await Services.getKetangkatan();
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAngkatan = async (req, res) => {
    const { id_prodi, id_ketangkatan } = req.query;
    try {
        const result = await Services.getAngkatan(id_prodi, id_ketangkatan);
        res.send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getMasterStatusIjin = async (req, res) => {
    const { id_level } = req.params;
    try {
        const result = await Services.getMasterStatusIjin(id_level);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateIjin = async (req, res) => {
    const { id_ijinkhusus, isApproved, id_level } = req.body;
    try {
        const result = await Services.updateIjin(id_ijinkhusus, isApproved, id_level);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    editUser,
    getUserbyId,
    getUsersByPartialUsername,
    getKetangkatan,
    getFakultas,
    getProdi,
    getAngkatan,
    deleteUser,
    register,
    getUsers,
    logout,
    login,
    forgetPassword,
    dinasLuar,
    ijinSakit,
    pengajuanCuti,
    getijinbyidketijin,
    deleteijin,
    approvedIjinSakit,
    getApprovedIjinSakit,
    resetPassword,
    pengajuanIzin,
    absensiDinasLuar,
    ketijin,
    listPengajuanIzin,
    hapusPengajuanIzin,
    getLevel,
    updateIjin,
    getMasterStatusIjin,    
}