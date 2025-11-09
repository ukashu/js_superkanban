import express from "express"
import { getProjects, createProject, editProject, deleteProject } from "./project.controllers.js"

const router = express.Router({ mergeParams: true })

router.route("/:projectId")
    .put(editProject)
    .delete(deleteProject)

router.route("/")
    .get(getProjects)
    .post(createProject)

export default router