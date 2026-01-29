import express from "express"
import {
    getTasksForProject,
    createTask,
    updateTask,
    deleteTask,
    unassignTask,
} from "./tasks.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import { isProjectOwnerOrAdmin } from "../middleware/authorization.middleware.js"

const router = express.Router({ mergeParams: true })

router.use(authenticateToken)

router
    .route("/")
    .get(getTasksForProject)
    .post(isProjectOwnerOrAdmin, createTask)

router
    .route("/:taskId")
    .put(updateTask)
    .delete(isProjectOwnerOrAdmin, deleteTask)
router.route("/:taskId/unassign").put(isProjectOwnerOrAdmin, unassignTask)

export default router
