export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token')
  console.log(token)

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })
}