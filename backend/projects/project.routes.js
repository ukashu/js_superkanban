import express from "express"
import {
    getProjects,
    createProject,
    editProject,
    deleteProject,
    getProjectById,
} from "./project.controllers.js"
import {
    isAdmin,
    isProjectOwnerOrAdmin,
} from "../middleware/authorization.middleware.js"
import { authenticateToken } from "../middleware/auth.middleware.js"
import { body } from "express-validator"

const router = express.Router({ mergeParams: true })

router.use(authenticateToken)

const validateProject = [
    body("title")
        .isString()
        .notEmpty()
        .withMessage("Project name is required and must be a string."),
]

router
    .route("/:projectId")
    .get(isProjectOwnerOrAdmin, getProjectById)
    .put(validateProject, isProjectOwnerOrAdmin, editProject)
    .delete(isProjectOwnerOrAdmin, deleteProject)

router.route("/").get(isAdmin, getProjects).post(validateProject, createProject)

export default router
