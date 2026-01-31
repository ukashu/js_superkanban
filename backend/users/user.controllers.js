import { dbGet, dbRun, dbAll } from "../db/db.js"
import { validationResult } from "express-validator"

const mockUsers = [
    { name: "JD", email: "johndoe@email.com" },
    { name: "JK", email: "jankowalski@email.com" },
]

export const getUserById = async (req, res, next) => {
    const userId = Number(req.params.userId)

    try {
        const user = await dbGet(
            "SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?",
            userId,
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query succesful",
            data: { user },
        })
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    const userId = Number(req.params.userId)

    try {
        const dbResult = await dbRun(
            "DELETE FROM users WHERE user_id = ?",
            userId,
        )

        if (!dbResult || dbResult.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query succesful",
            data: { dbResult },
        })
    } catch (err) {
        next(err)
    }
}

export const editUser = async (req, res, next) => {
    const userId = Number(req.params.userId)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors)
    }

    const { username, email, password, is_admin } = req.body

    if (is_admin !== undefined && req.user.is_admin !== 1) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only admin can change role.",
        })
    }

    try {
        const dbResult = await dbRun(
            `UPDATE users
            SET 
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                password = COALESCE(?, password),
                is_admin = COALESCE(?, is_admin)
            WHERE user_id = ?`,
            [username, email, password, is_admin, userId],
        )

        if (dbResult.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: { userId },
        })
    } catch (err) {
        next(err)
    }
}

export const findUsers = async (req, res, next) => {
    try {
        let email = req.query.email

        if (!email) {
            const users = await dbAll("SELECT user_id, name, email FROM users")
            return res.status(200).json({ success: true, data: users })
        }

        email = email.toLowerCase()

        const users = await dbAll(
            `SELECT user_id, name, email
             FROM users
             WHERE LOWER(email) LIKE ?`,
            [`%${email}%`],
        )

        return res.status(200).json({ success: true, data: users })
    } catch (err) {
        next(err)
    }
}

export const getTasksForUser = async (req, res, next) => {
    const { userId } = req.params
    const { sortBy, groupBy } = req.query
    const limit = Number(req.query.limit) || 20
    const offset = Number(req.query.offset) || 0

    try {
        let query =
            "SELECT t.*, p.title as project_name FROM tasks t JOIN projects p ON t.project_id = p.project_id WHERE t.assignee_id = ?"
        const params = [userId]

        if (sortBy === "assignment_date") {
            query += " ORDER BY t.assignment_date"
        } else if (sortBy === "project_id") {
            query +=
                " AND t.status != 'BACKLOG' ORDER BY t.project_id ASC, t.task_id ASC"
        } else {
            query += " ORDER BY t.task_id ASC"
        }

        if (limit != null && offset != null) {
            query += " LIMIT ? OFFSET ?"
            params.push(limit, offset)
        }

        const tasks = await dbAll(query, params)

        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "Not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query successful",
            data: {
                tasks,
                hasMore: tasks.length === limit,
            },
        })
    } catch (err) {
        next(err)
    }
}

export const getProjectsForUser = async (req, res, next) => {
    const { userId } = req.params

    try {
        const projects = await dbAll(
            `SELECT DISTINCT * FROM projects WHERE owner_id = ?`,
            [userId],
        )

        return res.status(200).json({
            success: true,
            data: { projects },
        })
    } catch (err) {
        next(err)
    }
}
