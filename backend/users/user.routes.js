import express from "express"
import {getUserProfile, deleteUser, editUser} from "./user.controllers.js"

const router = express.Router({mergeParams: true})

router.route("/:userId")
.get(getUserProfile)
.delete(deleteUser)
.put(editUser)

export default router