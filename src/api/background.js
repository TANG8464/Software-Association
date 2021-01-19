import request from "@/utils/request";

/**
 * 获取所有背景
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 */
export async function getAllBackground(currPage, limit) {
    const { data } = await request({
        url: 'sys/background/page',
        method: 'get',
        params: { currPage, limit }
    })


    return data
}
/**
 * 前台获取所有可用背景
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 */
export async function getAllBackgroundFrontDesk(currPage, limit) {
    const { data } = await request({
        url: 'sys/background/re/page',
        method: 'get',
        params: { currPage, limit }
    })
    return data
}
/**
 * 上传背景图片
 * @param {Array} fileList 文件数组
 * @param {Object} config 其他配置函数 例如上传进行时调用的钩子
 */
export async function uploadBackground(fileList, config) {
    const formData = new FormData()
    for (let file of fileList)
        formData.append('backgroundPictures', file)
    const { data } = await request(Object.assign({
        url: 'sys/background/',
        method: 'post',
        data: formData,
    }, config))
    return data
}
/**
 * 根据图片名称删除背景
 * @param {String} pictureName 图片名称 
 */
export async function deleteBackground(pictureName) {
    const { data } = await request({
        url: `sys/background/${pictureName}`,
        method: 'delete'
    })
    return data
}
/**
 * 根据图片id更改图片是否在前台展示
 * @param {*} backgroundId 图片id
 * @param {*} status 修改的图片状态 是否在前台展示
 */
export async function updateBackgroundStatus(backgroundId, status) {

    const { data } = await request({
        url: `sys/background/${backgroundId}/status`,
        method: 'put',
        params: { status }
    })
    return data
}
/**
 * 根据id获取背景图
 * @param {Number} backgroundId 
 */
export async function getBackgroundById(backgroundId) {

    const data = await request({
        url: `sys/background/info/${backgroundId}`,
        method: 'get'
    })
    if (data) return data.data
    return data
}