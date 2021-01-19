import request from "@/utils/request"


/**
 * 查询所有七牛云配置
 */
export async function searchAllQiNiuYun() {
    const { data } = await request({
        url: `config/qiniu/list`,
        method: 'get'
    })
    return data
}
/**
 * 添加七牛云配置
 * @param {Object} param0 
 */
export async function addQiNiuYun({ accessKey, bucketName, domainOfBucket, region, remark, securityKey } = {}) {
    const { data } = await request({
        url: `config/qiniu/`,
        method: 'post',
        data: { accessKey, bucketName, domainOfBucket, region, remark, securityKey }
    })
    return data
}

/**
 * 删除七牛云配置
 * @param {Object} param0 
 */
export async function deleteQiNiuYun({ id, password } = {}) {
    const { data } = await request({
        url: `config/qiniu/`,
        method: 'delete',
        data: { id, password }
    })
    return data
}

/**
 * 修改七牛云配置
 * @param {Number} qiniuId 
 * @param {Object} param1 
 */
export async function updateQiNiuYun(qiniuId, { accessKey, bucketName, domainOfBucket, region, remark, securityKey } = {}) {
    const { data } = await request({
        url: `config/qiniu/${qiniuId}`,
        method: 'put',
        data: { accessKey, bucketName, domainOfBucket, region, remark, securityKey }
    })
    return data
}



export async function updateQiNiuYunStatus(qiniuId, status) {
    const { data } = await request({
        url: `config/qiniu/${qiniuId}/info`,
        method: 'put',
        params: { status }
    })
    return data
}