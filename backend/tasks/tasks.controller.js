import { dbAll, dbGet, dbRun } from "../db/db.js"

export const getTasks = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);

    const tasks = await dbAll(
      "SELECT * FROM tasks WHERE project_id = ? ORDER BY task_id ASC",
      [projectId]
    );

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const { title, description, status, assignee_id } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const allowedStatuses = ["BACKLOG", "DOING", "REVIEW", "DONE"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await dbRun(
      `INSERT INTO tasks (project_id, assignee_id, title, description, status, assignment_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        assignee_id || null,
        title,
        description || null,
        status || "BACKLOG",
        new Date().toISOString(),
      ]
    );

    const newTask = await dbGet("SELECT * FROM tasks WHERE task_id = ?", [
      result.lastID,
    ]);

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, assignee_id } = req.body;

    const allowedStatuses = ["BACKLOG", "DOING", "REVIEW", "DONE"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await dbRun(
      `UPDATE tasks
       SET 
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         status = COALESCE(?, status),
         assignee_id = COALESCE(?, assignee_id)
       WHERE task_id = ? AND project_id = ?`,
      [title, description, status, assignee_id, taskId, projectId]
    );

    const updatedTask = await dbGet("SELECT * FROM tasks WHERE task_id = ?", [
      taskId,
    ]);

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

    await dbRun("DELETE FROM tasks WHERE task_id = ? AND project_id = ?", [
      taskId,
      projectId,
    ]);

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
