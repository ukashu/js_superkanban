import sqlite3 from "sqlite3"
import fs from "fs"
import path from "path"

const DB_PATH = path.join(
    process.cwd(),
    "db",
    `${process.env.NODE_ENV === "production" ? "production.sqlite" : "test.sqlite"}`,
)
const DB_EXISTS = fs.existsSync(DB_PATH)

// create /db folder
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

// open db
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Failed to open the database:", err)
        process.exit(1)
    }
})

// db interation wrapper function for error handling
function runOrFail(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

async function initDatabase() {
    try {
        await runOrFail(db, "PRAGMA foreign_keys = ON;")

        await runOrFail(
            db,
            `
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                is_admin INTEGER DEFAULT 0
            );
        `,
        )

        await runOrFail(
            db,
            `
            CREATE TABLE IF NOT EXISTS projects (
                project_id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner_id INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE SET NULL
            );
        `,
        )

        await runOrFail(
            db,
            `
            CREATE TABLE IF NOT EXISTS tasks (
                task_id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                assignee_id INTEGER,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT CHECK (status IN ('BACKLOG','DOING','REVIEW','DONE')) DEFAULT 'BACKLOG',
                assignment_date TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL,
                FOREIGN KEY (assignee_id) REFERENCES users(user_id) ON DELETE SET NULL
            );
        `,
        )

        if (!DB_EXISTS) {
            // seed sample data
            await runOrFail(
                db,
                `
                INSERT INTO users (name, email, password, is_admin)
                VALUES ('Shiv', 'alice@example.com', 'hashed_password', 0);
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO users (name, email, password, is_admin)
                VALUES ('Paige', 'paige@example.com', 'hashed_password', 1);
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO users (name, email, password)
                VALUES ('Vindicta', 'vindicta@example.com', 'hashed_password');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO projects (owner_id, title, description)
                VALUES (1, 'Initial Project Title 1', 'Initial Project Desc 1');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO projects (owner_id, title, description)
                VALUES (2, 'Second Project', 'Second Project Description');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (1, 1, 'Initial Task 1 Title', 'Initial Task 1 Desc', '${new Date("2023-01-15").toISOString()}');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (1, 3, 'Initial Task 2 Title', 'Initial Task 2 Desc', '${new Date("2023-01-16").toISOString()}');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (1, 1, 'Another Task for User 1', 'Another Task Desc', '${new Date("2023-01-17").toISOString()}');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (1, 2, 'Task for User 2', 'Task for User 2 Desc', '${new Date("2023-01-18").toISOString()}');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (2, 1, 'Task for User 1 in Project 2', 'Task for User 1 in Project 2 Desc', '${new Date("2023-01-19").toISOString()}');
            `,
            )

            await runOrFail(
                db,
                `
                INSERT INTO tasks (project_id, assignee_id, title, description, assignment_date)
                VALUES (2, 1, 'Another Task for User 1 in Project 2', 'Another Task for User 1 in Project 2 Desc', '${new Date("2023-01-20").toISOString()}');
            `,
            )
        }
    } catch (err) {
        console.error("Database initialization failed:", err)
        process.exit(1)
    }
}

initDatabase()

export default db
