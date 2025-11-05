import express from "express"
import {getUserProfile, deleteUser, editUser, findUsers} from "./user.controllers.js"

const router = express.Router({mergeParams: true})

router.route("/:userId")
.get(getUserProfile)
.delete(deleteUser)
.put(editUser)

router.route("/")
.get(findUsers)

export default router