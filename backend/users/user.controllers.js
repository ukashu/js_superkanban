import { dbGet, dbRun, dbAll } from "../db/db.js"

const mockUsers = [{name: "JD", email: "johndoe@email.com"}, {name: "JK", email: "jankowalski@email.com"}]

export const getUserById = async (req, res) => {
    const userId = Number(req.params.userId)

    try {
        const user = await dbGet(
            "SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?",
            userId
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Not found"
            })
        }

        // TODO we do not want to return is_admin in the response
        return res.status(200).json({
            success: true,
            message: "Query succesful",
            data: {
                user
            }
        })
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res) => {
    const userId = Number(req.params.userId)

    try {
        const dbResult = await dbRun(
            "DELETE FROM users WHERE user_id = ?",
            userId
        )

        if (!dbResult) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query succesful",
            data: { dbResult }
        })
    } catch (err) {
        next(err)
    }
}

export const editUser = async (req, res) => {
    const userId = Number(req.params.userId)
    const { name, email, password, is_admin } = req_body

    try {
        // TODO add updating partially
        const dbResult = await dbRun(
            `UPDATE users
            SET name = ?, email = ?, password = ?, is_admin = ?
            WHERE user_id = ?`,
            [name, email, password, is_admin, userId]
        )

        if (dbResult.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: { userId }
        })
    } catch (err) {
        next(err)
    }
}

export const findUsers = async (req, res) => {
    try {
        let email = String(req.query.email)
        if (!email) {
            return res.status(400).json({ success: false, message: "Email query required" })
        }
        email = email.toLowerCase()

        const users = await dbAll(
            `SELECT user_id, name, email, is_admin
            FROM users
            WHERE LOWER(email) LIKE ?`,
            [`%${email}%`]
        )

        return res.status(200).json({
            success: true,
            message: "Query successful",
            data: users
        })

    } catch (err) {
        next(err)
    }
}