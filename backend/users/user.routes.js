import express from "express"
import {getUserById, deleteUser, editUser, findUsers, getTasksForUser} from "./user.controllers.js"
import { body } from "express-validator"

const router = express.Router({mergeParams: true})

const validateUserDetails = [
    body("username")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    body("is_admin")
        .optional()
        .isBoolean().withMessage("is_admin must be true or false")
        .toBoolean(),
]

router.route("/:userId/tasks")
.get(getTasksForUser)

router.route("/:userId")
.get(getUserById)
.delete(deleteUser)
.put(editUser)

router.route("/")
.get(findUsers)

export default router