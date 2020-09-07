import request from "@/utils/request"

/**
 * 解除绑定账号
 * @param {String} source 
 */
export async function unbind(source) {
    let { data } = await request({
        url: `oauth/bind/cancel/${source}`,
        method: 'put'
    })
    return data

}
/**
 * 账号绑定
 * @param {String} source 
 */
export async function binding(source) {
    let { data } = await request({
        url: `oauth/bind/sender/${source}`,
        method: 'get'
    })
    return data

}


export async function oauthLogin(source) {
    let { data } = await request({
        url: `oauth/sender/${source}`,
        method: 'get'
    })
    return data

}