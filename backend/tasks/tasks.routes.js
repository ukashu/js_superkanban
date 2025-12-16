import express from "express"
import {
    getTasksForProject,
    createTask,
    updateTask,
    deleteTask,
} from "./tasks.controller.js"

const router = express.Router({ mergeParams: true })

router.route("/").get(getTasksForProject).post(createTask)

router.route("/:taskId").put(updateTask).delete(deleteTask)

export default router
