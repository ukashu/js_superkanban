import jwt from "jsonwebtoken"
import { dbGet } from "../db/db.js"

// UWAGA: Klucz powinien być przechowywany w zmiennych środowiskowych, a nie na stałe w kodzie.
const JWT_SECRET = process.env.JWT_SECRET || "super-tajny-klucz-do-zmiany"

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        res.status(401)
        // TODO nie wiem czy tutaj nie trzeba mieć takiego samego formatu jak w error.middleware
        return res.json({
            success: false,
            message: "Unauthorized",
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await dbGet(
            "SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?",
            [decoded.id],
        )

        if (!user) {
            res.status(403)
            return res.json({
                success: false,
                message: "Access denied",
            })
        }

        req.user = user
        next()
    } catch (err) {
        res.status(403)
        return res.json({
            success: false,
            message: "Access denied",
        })
    }
}
