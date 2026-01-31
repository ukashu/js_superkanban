import { dbAll, dbGet, dbRun } from "../db/db.js"
import { validationResult } from "express-validator"

export const getProjects = async (req, res, next) => {
    try {
        const projects = await dbAll("SELECT * FROM projects")
        res.status(200).json({
            success: true,
            message: "Query successful",
            data: { projects },
        })
    } catch (error) {
        next(error)
    }
}

export const getProjectById = async (req, res, next) => {
    console.log("HIT THE ENDPOINT!!!!!")
    const projectId = Number(req.params.projectId)
    try {
        const project = await dbGet(
            "SELECT * FROM projects WHERE project_id = ?",
            [projectId],
        )

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }
        res.status(200).json({ message: "Query successful", data: project })
    } catch (error) {
        next(error)
    }
}

export const createProject = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, owner_id } = req.body

    try {
        const result = await dbRun(
            "INSERT INTO projects (title, description, owner_id) VALUES (?, ?, ?)",
            [title, description || "", owner_id || null],
        )

        const newProject = await dbGet(
            "SELECT * FROM projects WHERE project_id = ?",
            [result.lastID],
        )

        res.status(201).json({
            message: "Project created successfully",
            data: newProject,
        })
    } catch (error) {
        next(error)
    }
}

export const editProject = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const projectId = Number(req.params.projectId)
    const { title, description } = req.body

    try {
        const project = await dbGet(
            "SELECT * FROM projects WHERE project_id = ?",
            [projectId],
        )
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        const updatedTitle = title || project.title
        const updatedDescription = description || project.description

        await dbRun(
            "UPDATE projects SET title = ?, description = ? WHERE project_id = ?",
            [updatedTitle, updatedDescription, projectId],
        )

        const updatedProject = await dbGet(
            "SELECT * FROM projects WHERE project_id = ?",
            [projectId],
        )

        res.status(200).json({
            message: "Project updated successfully",
            data: updatedProject,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProject = async (req, res, next) => {
    const projectId = Number(req.params.projectId)
    try {
        const project = await dbGet(
            "SELECT * FROM projects WHERE project_id = ?",
            [projectId],
        )
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        await dbRun("DELETE FROM projects WHERE project_id = ?", [projectId])

        res.status(200).json({
            message: "Project deleted successfully",
            projectId: projectId,
        })
    } catch (error) {
        next(error)
    }
}
