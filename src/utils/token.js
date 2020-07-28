const headerToken = 'HEADER-TOKEN'

const token = {
    getHeaderToken: () => {
        return localStorage.getItem(headerToken)
    },
    setHeaderToken: token => {
        localStorage.setItem(headerToken, token)
    },
    removeHeaderToken: () => {
        localStorage.removeItem(headerToken)
    }
}
export default token