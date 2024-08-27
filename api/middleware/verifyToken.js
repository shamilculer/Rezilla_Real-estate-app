import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "Not authenticated" })
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
            res.status(403).json({ message: "Invalid token" })
            return;
        }
        req.userId = payload.id
        next();
    })

}

export default verifyToken;