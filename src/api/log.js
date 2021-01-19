import request from "@/utils/request"


/**
 * 分页查找系统日志数据
 * @param {Object} param0 
 */
export async function searchLog({ currPage, limit, logName } = {}) {
    const { data } = await request({
        url: `log/page`,
        method: 'get',
        params: { currPage, limit, logName }
    })
    return data
}
/**
 * 导出日志
 * @param {Object} param0 
 */
export async function downloadLog({ currPage, limit, logName } = {}) {
    const { data } = await request({
        url: `log/downloadLog`,
        method: 'get',
        responseType: 'blob',
        params: { currPage, limit, logName }
    })
    return data
}