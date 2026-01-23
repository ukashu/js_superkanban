export async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token")

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    })
}

export function formatDate(isoString) {
    if (!isoString) return isoString

    const date = new Date(isoString)

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}
