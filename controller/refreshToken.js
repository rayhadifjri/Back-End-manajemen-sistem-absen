const {Users} = require('../models')
const jwt = require('jsonwebtoken')

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            throw new Error("Refresh Token tidak ada")
        }
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        })
        if (!user) return res.sendStatus(403) // Forbidden
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const username = user[0].username
            const email = user[0].email
            const id_level = user[0].id_level
            const accessToken = jwt.sign({ username, email, id_level }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            res.json({ accessToken })
        });
        
    }
    catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    refreshToken
}