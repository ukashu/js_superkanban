import express from "express"
import errorHandler from "./middleware/error.middleware.js"
import userRoutes from "./users/user.routes.js"
import projectRoutes from "./projects/project.routes.js"
import taskRoutes from "./tasks/tasks.routes.js"
import db from "./db/dbInit.js"
import cors from "cors"

const app = express()
const PORT = Number(process.env.PORT) || 5000

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("API is running...")
})

app.use("/api/projects/:projectId/tasks", taskRoutes)
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
