import { dbGet, dbRun } from "../db/db.js"

const mockUsers = [{name: "JD", email: "johndoe@email.com"}, {name: "JK", email: "jankowalski@email.com"}]

export const getUserById = async (req, res) => {
    const userId = Number(req.params.userId)

    try {
        const user = await dbGet(
            "SELECT user_id, name, email, is_admin FROM users WHERE user_id = ?",
            userId
        )

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Not found"
            })
        }

        // TODO we do not want to return is_admin in the response
        res.status(200).json({
            success: true,
            message: "Query succesful",
            data: {
                user
            }
        })
    } catch (err) {
        throw new Error(err)
    }
}

export const deleteUser = async (req, res) => {
    const userId = Number(req.params.userId)

    try {
        const user = await dbRun(
            "DELETE FROM users WHERE user_id = ?",
            userId
        )

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Query succesful",
            data: {
                user
            }
        })
    } catch (err) {
        throw new Error(err)
    }
}

export const editUser = (req, res) => {
    const userId = Number(req.params.userId)

    // user not found
    if (mockUsers.length < userId) {
        res.status(404).json({success: false, message:"Not found"})
    }

    res.status(200).json({success: true, message: "Query succesful", userId: userId})
}

export const findUsers = (req, res) => {
    let email = String(req.query.email)
    email = email.toLowerCase()

    const matchingUsers = mockUsers.filter((item)=>{
        return item.email.includes(email)
    })

    if (matchingUsers.length) {
        res.status(200).json({success: true, message: "Query succesful", users: matchingUsers})
    } else {
        res.status(404).json({success: false, message: "Not found"})
    }
}