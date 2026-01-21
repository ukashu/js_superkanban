import { dbAll, dbGet, dbRun } from "../db/db.js"

export const getTasksForProject = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId)
        const { sortBy, groupBy, assigneeName } = req.query
        const limit = Number(req.query.limit) || 20
        const offset = Number(req.query.offset) || 0

        let query =
            "SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assignee_id = u.user_id WHERE t.project_id = ?"
        const params = [projectId]

        const projectOwner = await dbAll(
            "SELECT owner_id FROM projects WHERE project_id = ?",
            projectId,
        )

        /*
        if (!projectOwner || projectOwner[0].owner_id != req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this resource",
            })
        }
        */

        if (assigneeName) {
            query += " AND u.name LIKE ?"
            params.push(`%${assigneeName}%`)
        }

        if (sortBy === "assignment_date") {
            query += " ORDER BY t.assignment_date"
        } else if (sortBy === "assignee_id") {
            query +=
                " AND t.status != 'BACKLOG' ORDER BY t.assignee_id ASC, t.task_id ASC"
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

export const createTask = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId)
        const { title, description, status, assignee_id } = req.body

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" })
        }

        const allowedStatuses = ["BACKLOG", "DOING", "REVIEW", "DONE"]
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        const result = await dbRun(
            `INSERT INTO tasks (project_id, assignee_id, title, description, status, assignment_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                projectId,
                assignee_id || null,
                title,
                description || null,
                status || "BACKLOG",
                new Date().toISOString(),
            ],
        )

        const newTask = await dbGet("SELECT * FROM tasks WHERE task_id = ?", [
            result.lastID,
        ])

        res.status(201).json(newTask)
    } catch (err) {
        next(err)
    }
}

export const updateTask = async (req, res, next) => {
    try {
        const { projectId, taskId } = req.params
        const { title, description, status, assignee_id } = req.body

        const allowedStatuses = ["BACKLOG", "DOING", "REVIEW", "DONE"]
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        const dbResult = await dbRun(
            `UPDATE tasks
       SET 
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         status = COALESCE(?, status),
         assignee_id = COALESCE(?, assignee_id)
       WHERE task_id = ? AND project_id = ?`,
            [title, description, status, assignee_id, taskId, projectId],
        )

        if (dbResult.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: { taskId },
        })
    } catch (err) {
        next(err)
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const { projectId, taskId } = req.params

        const dbResult = await dbRun(
            "DELETE FROM tasks WHERE task_id = ? AND project_id = ?",
            [taskId, projectId],
        )

        if (!dbResult) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
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
