const jwt = require("jsonwebtoken");

const adminOnly = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.status(401).json({ error: "Unauthorized - Token is null" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id_level = decoded.id_level 
        if (id_level!= 1) {
            return res.status(403).json({ error: "Forbidden - Not Admin" });
        }
        next();
    } catch (error) {
        return res.status(403).json({ error: "Forbidden - Token is not valid" });
    }
}

module.exports = {
    adminOnly
}
