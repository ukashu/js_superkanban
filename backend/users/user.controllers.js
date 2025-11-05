export const getUserProfile = (req, res) => {
    const userId = Number(req.params.userId)

    res.status(200).json({message: "Query succesful", userId: userId})
}