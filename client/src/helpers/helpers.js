export async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token")

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    })
    if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("is_admin")
        window.location.href = "/login"
    }

    return response
}

export function getCurrentUser() {
    const userId = localStorage.getItem("user_id")
    const isAdmin = localStorage.getItem("is_admin")

    return {
        userId: userId ? Number(userId) : null,
        isAdmin: isAdmin === "1" || isAdmin === "true",
    }
}
