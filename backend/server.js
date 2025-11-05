import express from "express"
import errorHandler from "./middleware/error.middleware.js"
import userRoutes from "./users/user.routes.js"

const app = express()
const PORT = Number(process.env.PORT) || 5000;

app.get("/", (req, res)=>{
    res.send("API is running...")
})

app.use("/users", userRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})