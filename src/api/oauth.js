import request from "@/utils/request"

/**
 * 解除绑定账号
 * @param {String} source 第三方名称
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
 * @param {String} source 第三方名称
 */
export async function binding(source) {
    let { data } = await request({
        url: `oauth/bind/sender/${source}`,
        method: 'get'
    })
    return data

}
/**
 * 第三方登录
 * @param {String} source 第三方名称
 */
export async function oauthLogin(source) {
    let { data } = await request({
        url: `oauth/sender/${source}`,
        method: 'get'
    })
    return data

}
/**
 * 获取登录成功信息
 * @param {String} key 
 */
export async function getSuccessInfo(key) {
    let { data } = await request({
        url: `oauth/get`,
        method: 'post',
        data: {
            key
        }
    })
    return data

}