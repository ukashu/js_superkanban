const mockProjects = [
    { id: 1, name: "Super Kanban Board", description: "A board to rule them all." },
    { id: 2, name: "Website Redesign", description: "Redesign the company website." }
];
let nextProjectId = 3;

export const getProjects = (req, res) => {
    res.status(200).json({ message: "Query successful", data: mockProjects });
};

export const createProject = (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Project name is required." });
    }

    const newProject = {
        id: nextProjectId++,
        name,
        description: description || ""
    };

    mockProjects.push(newProject);

    res.status(201).json({ message: "Project created successfully", data: newProject });
};


export const editProject = (req, res) => {
    const projectId = Number(req.params.projectId);
    const projectIndex = mockProjects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
    }

    const originalProject = mockProjects[projectIndex];
    const updatedProject = {
        ...originalProject,
        ...req.body
    };
    mockProjects[projectIndex] = updatedProject;

    res.status(200).json({ message: "Project updated successfully", data: updatedProject });
};

export const deleteProject = (req, res) => {
    const projectId = Number(req.params.projectId);
    const projectIndex = mockProjects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" });
    }

    mockProjects.splice(projectIndex, 1);

    res.status(200).json({ message: "Project deleted successfully", projectId: projectId });
};