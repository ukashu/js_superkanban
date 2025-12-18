import jwt from "jsonwebtoken"
import { dbGet } from "../db/db.js"

// UWAGA: Klucz powinien być przechowywany w zmiennych środowiskowych, a nie na stałe w kodzie.
const JWT_SECRET = process.env.JWT_SECRET || "super-tajny-klucz-do-zmiany"

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await dbGet(
            "SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?",
            [decoded.id],
        )

        if (!user) {
            return res.sendStatus(403)
        }

        req.user = user
        next()
    } catch (err) {
        return res.sendStatus(403)
    }
}
