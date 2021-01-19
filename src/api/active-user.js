import request from '@/utils/request'
/**
 * 获取当前登录账号的基本个人信息
 */
export function getActiveUserInfo() {
    return request({
        url: 'member/info',
        method: 'get'
    })
}
/**
 * 获取当前登录账号的详细个人信息
 */
export function detailedInformation() {
    return request({
        url: 'member/person',
        method: 'get'
    })
}
/**
 * 获取当前用户权限
 */
export async function getActiveUserRole() {
    const { data } = await detailedInformation()
    return data.data ? data.data.roles : []
}
/**
 * 退出登录
 */
export function logout() {
    return request({
        url: 'member/logout',
        method: 'put'
    })
}
/**
 * 忘记密码
 * @param {String} email 
 */
export async function forgetPassword(email) {
    const { data } = await request({
        url: `/forgetPassword`,
        method: 'post',
        params: { email }
    })
    return data
}


export async function updatePassword({ email, newPassword, verify } = {}) {
    const { data } = await request({
        url: `/updatePassword`,
        method: 'post',
        params: { email, newPassword, verify }
    })
    return data
}
/**
 * 个人中心修改密码
 * @param {Object} param0 
 */
export async function updateMemberPassword({ newPassword, oldPassword } = {}) {
    const { data } = await request({
        url: `/member/password`,
        method: 'put',
        data: { newPassword, oldPassword }
    })
    return data
}
/**
 * 个人中心修改自己的信息
 * @param {Object} personInfo 
 */
export async function updatePersonInfo(personInfo) {
    const { data } = await request({
        url: `member/person`,
        method: 'put',
        data: personInfo
    })
    return data
}