import request from '@/utils/request'
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