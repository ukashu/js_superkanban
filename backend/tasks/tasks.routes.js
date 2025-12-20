import express from "express"
import {
    getTasksForProject,
    createTask,
    updateTask,
    deleteTask,
} from "./tasks.controller.js"

import { authenticateToken } from "../middleware/auth.middleware.js" 

const router = express.Router({ mergeParams: true })

router.route("/").get(authenticateToken, getTasksForProject).post(createTask)

router.route("/:taskId").put(updateTask).delete(deleteTask)

export default router
