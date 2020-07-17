const headerToken = 'HEADER-TOKEN'

export function getHeaderToken() {
    return localStorage.getItem(headerToken)
}
export function setHeaderToken(token) {
    localStorage.setItem(headerToken, token)
}
export function removeHeaderToken() {
    localStorage.removeItem(headerToken)
}