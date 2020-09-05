export default function imgVerify(file, type, size, error) {
    console.log(file, type, size, error)
    const TypeVerify = type.includes(file.type)
    const isLt2M = file.size / 1024 / 1024 < size
    if (!TypeVerify) {
        return { status: false, type: 'error', message: error[0] || '' }
    } else if (!isLt2M) {
        return { status: false, type: 'error', message: error[1] || '' }
    } else return { status: true }
}
export function excelVerify(file) {
    const excel = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    const isExcel = excel.includes(file.type)

    return isExcel
}
export function userNameVerify(userName) {
    const userNameTest = /^\S{4,10}$/
    return userNameTest.test(userName)
}
export function pwdVerify(pwd) {
    const pwdTest = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/
    return pwdTest.test(pwd)
}
export function phoneVerify(phone) {
    const phoneTest = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
    return phoneTest.test(phone)
}
export function cardIdVerify(cardId) {
    const cardIdTest = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
    return cardIdTest.test(cardId)
}
export function stuNumVerify(stuNum) {
    const stuNumTest = /^\d{2,3}$/
    return stuNumTest.test(stuNum)
}
export function emailVerify(email) {
    const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailTest.test(email)
}