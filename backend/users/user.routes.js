import express from "express"
import {getUserProfile} from "./user.controllers.js"

const router = express.Router({mergeParams: true})

router.route("/:userId")
.get(getUserProfile)

export default router