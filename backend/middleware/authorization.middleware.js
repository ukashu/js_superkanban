import { dbGet } from "../db/db.js"

export const isProjectOwnerOrAdmin = async (req, res, next) => {
    try {
        const userId = req.user.user_id
        const isAdmin = req.user.is_admin

        if (isAdmin) {
            return next()
        }

        let projectId
        if (req.params.projectId) {
            projectId = req.params.projectId
        } else if (req.body.project_id) {
            projectId = req.body.project_id
        } else if (req.params.taskId) {
            const task = await dbGet(
                "SELECT project_id FROM tasks WHERE task_id = ?",
                [req.params.taskId],
            )
            if (task) {
                projectId = task.project_id
            }
        }

        if (!projectId) {
            return res
                .status(400)
                .json({ success: false, message: "Project ID not found" })
        }

        const project = await dbGet(
            "SELECT owner_id FROM projects WHERE project_id = ?",
            [projectId],
        )

        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Project not found" })
        }

        if (project.owner_id !== userId) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Access denied. Not a project owner.",
                })
        }

        next()
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" })
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.is_admin === 1) {
        return next()
    }
    return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
    })
}

export const isSameUserOrAdmin = (req, res, next) => {
    const requestedUserId = Number(req.params.userId)
    const currentUserId = req.user.user_id
    const isAdmin = req.user.is_admin === 1

    if (isAdmin || requestedUserId === currentUserId) {
        return next()
    }

    return res.status(403).json({
        success: false,
        message: "Access denied.",
    })
}
