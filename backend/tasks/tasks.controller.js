const mockTasks = [
  { title: "Task 1", description: "First task" },
  { title: "Task 2", description: "Second task" },
];

export const getTasks = (req, res) => {
  const projectId = Number(req.params.projectId);
  res.status(200).json({
    message: "Hello, world! (GET tasks)",
    projectId,
    data: mockTasks,
  });
};

export const createTask = (req, res) => {
  const projectId = Number(req.params.projectId);
  res.status(200).json({
    message: "Hello, world! (POST task)",
    projectId,
  });
};

export const updateTask = (req, res) => {
  const { projectId, taskId } = req.params;
  res.status(200).json({
    message: "Hello, world! (PUT task)",
    projectId,
    taskId,
  });
};

export const deleteTask = (req, res) => {
  const { projectId, taskId } = req.params;
  res.status(200).json({
    message: "Hello, world! (DELETE task)",
    projectId,
    taskId,
  });
};
