const express = require('express');
const { Services } = require("../services");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel.js");

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
    const {id_user} = req.params
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
        var result = await Services.editUser(id_user , username, password);
        if (!result) {
            throw new Error("Gagal Update User");
        }
        res.send(result);
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
    const { username, password } = req.body;
    try {
        const hasil = await Services.login(username, password);
        if (!hasil) {
            throw new Error("Username atau Password Salah");
        } else {
            const id_level = hasil.id_level;
            const accessToken = jwt.sign({ username, password, id_level }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ username, password, id_level }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

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

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.sendStatus(204);
        }
        // await Services.logout(refreshToken);
        if (refreshToken) {
            await Services.logout(refreshToken);
        }else {
            return res.sendStatus(204);
        }
        res.clearCookie("refreshToken");
        return res.send("Berhasil Logout");
    } catch (error) {
        console.log(error);
    }
}

const ijinSakit = async (req, res) => {
    const { id_user } = req.params;
    const { id_ketijin, tanggal_mulai, tanggal_selesai, deskripsi, status_ijin } = req.body;
    const file = req.files; // Menggunakan req.file karena menggunakan .single() dalam multer
    try {
        const result = await Services.ijinSakit(id_user, id_ketijin, tanggal_mulai, tanggal_selesai, files, deskripsi, status_ijin);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
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