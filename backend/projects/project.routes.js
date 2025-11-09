import express from "express"
import {createProject, editProject, deleteProject} from "./project.controllers.js"

const router = express.Router({mergeParams: true})

router.route("/:projectId")
.put(editProject)
.delete(deleteProject)

router.route("/")
.post(createProject)

export default router