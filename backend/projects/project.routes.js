import express from "express"
import { getProjects, createProject, editProject, deleteProject, getProjectById } from "./project.controllers.js"
import { body } from "express-validator"

const router = express.Router({ mergeParams: true })

const validateProject = [
    body('title').isString().notEmpty().withMessage('Project name is required and must be a string.'),
]

router.route("/:projectId")
    .get(getProjectById)
    .put(validateProject, editProject)
    .delete(deleteProject)

router.route("/")
    .get(getProjects)
    .post(validateProject, createProject)

export default router