import { dbGet, dbRun } from "../db/db.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// UWAGA: Klucz powinien być przechowywany w zmiennych środowiskowych, a nie na stałe w kodzie.
const JWT_SECRET = process.env.JWT_SECRET || "super-tajny-klucz-do-zmiany"

export const register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, username } = req.body

    try {
        const userExists = await dbGet(
            "SELECT user_id FROM users WHERE email = ?",
            [email],
        )
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Użytkownik o tym adresie e-mail już istnieje.",
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const result = await dbRun(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
        )

        const token = jwt.sign({ id: result.lastID }, JWT_SECRET, {
            expiresIn: "1h",
        })

        res.status(201).json({
            success: true,
            message: "Użytkownik zarejestrowany pomyślnie.",
            data: {
                token,
                user: {
                    id: result.lastID,
                    username,
                    email,
                },
            },
        })
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        const user = await dbGet("SELECT * FROM users WHERE email = ?", [email])
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowe dane uwierzytelniające.",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowe dane uwierzytelniające.",
            })
        }

        const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
            expiresIn: "1h",
        })

        res.status(200).json({
            success: true,
            message: "Zalogowano pomyślnie.",
            data: {
                token,
                user: {
                    id: user.user_id,
                    username: user.name,
                    email: user.email,
                    is_admin: user.is_admin,
                },
            },
        })
    } catch (err) {
        next(err)
    }
}
