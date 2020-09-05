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

export async function binding(source) {
    let { data } = await request({
        url: `oauth/bind/callback/${source}`,
        method: 'get'
    })
    return data

}