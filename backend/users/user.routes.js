import express from "express"
import {getUserById, deleteUser, editUser, findUsers} from "./user.controllers.js"

const router = express.Router({mergeParams: true})

router.route("/:userId")
.get(getUserById)
.delete(deleteUser)
.put(editUser)

router.route("/")
.get(findUsers)

export default router