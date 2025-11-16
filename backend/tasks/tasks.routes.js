import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./tasks.controller.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getTasks).post(createTask);

router.route("/:taskId").put(updateTask).delete(deleteTask);

export default router;
