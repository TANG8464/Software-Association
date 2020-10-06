import request from '@/utils/request'
import store from '@/store'
export function getActiveUserInfo() {
    return request({
        url: 'member/info',
        method: 'get'
    })
}
export function detailedInformation() {
    return request({
        url: 'member/person',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: 'member/logout',
        method: 'put'
    })
}
export async function forgetPassword(email) {
    const { data } = await request({
        url: `/forgetPassword`,
        method: 'post',
        params: { email }
    })
    return data
}


export async function updatePassword({ email, newPassword, verify }) {
    const { data } = await request({
        url: `/updatePassword`,
        method: 'post',
        params: { email, newPassword, verify }
    })
    return data
}
export async function updatePersonInfo(personInfo) {
    const { data } = await request({
        url: `member/person`,
        method: 'put',
        data: personInfo
    })
    return data
}
/**
 * 注册邮箱验证
 * @param {String} email 
 */
export async function verifyEmail(email) {
    const { data } = await request({
        url: `verifyEmail`,
        method: 'get',
        params: { email }
    })
    return data
}