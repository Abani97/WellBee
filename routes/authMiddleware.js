const jwt = require("jsonwebtoken");
const jwtHash =
    "u*hyyXzYHVxVCaK&HupFNg2RDgG53wF%CuQ6yotXENnVo2@&gUze8#952a^Bvi$e5ft8";

function verifyToken(req, res, next) {
    const token = req.cookies["token"];
    if (!token) return res.redirect("/login");

    jwt.verify(token, jwtHash, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        req.userId = decoded.userId;
        next();
    });
}

module.exports = { verifyToken, jwtHash };
