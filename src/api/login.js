import request from "@/utils/request"
/**
 * 获取RSA公钥，密码加密
 */
export async function getPublicKey() {
    const { data } = await request({
        url: 'login/key',
        method: 'get'
    })
    return data
}
/**
 * 获取验证码
 */
export async function getVerifyCode() {
    const { data } = await request({
        url: 'verifyImage/',
        method: 'get',
    })
    const img = data.data.img
    return img
}

/**
 * 登录
 * @param {Object} param 
 */
export async function login(param) {
    const { data } = await request({
        url: 'login',
        method: 'post',
        data: param
    })
    return data
}

/**
 * 注册账号
 * @param {Object} param0 注册信息
 */
export async function register(params) {
    const { data } = await request({
        url: `register`,
        method: 'post',
        params
    })
    return data
}
