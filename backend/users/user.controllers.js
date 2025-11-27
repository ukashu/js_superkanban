const mockUsers = [{name: "JD", email: "johndoe@email.com"}, {name: "JK", email: "jankowalski@email.com"}]

export const getUserProfile = (req, res) => {
    const userId = Number(req.params.userId)

    // user not found
    if (mockUsers.length < userId) {
        res.status(404).json({message:"Not found"})
    }

    res.status(200).json({success: true, message: "Query succesful", data: mockUsers[userId-1]})
}

export const deleteUser = (req, res) => {
    const userId = Number(req.params.userId)

    // user not found
    if (mockUsers.length < userId) {
        res.status(404).json({success: false, message:"Not found"})
    }

    mockUsers.splice(userId-1, 1)

    res.status(200).json({success: true, message: "Query succesful", userId: userId})
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