export const setToken = (token: string) => {
    localStorage.setItem("zapier_token", token)
}

export const getToken = (): string | null => {
    return localStorage.getItem("zapier_token")
}

export const clearToken = () => {
    localStorage.removeItem("zapier_token")
}