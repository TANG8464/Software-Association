import request from "@/utils/request";
import { RESOURCE } from '../constant'

/**
 * 前台获取所有资源
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 * @param {Number} resourceCategoryId 资源id
 * @param {String} resourceName 资源Name
 */
export async function getAllResource(currPage, limit, resourceCategoryId, resourceName) {
    const { data } = await request({
        url: 'resources/reception/page',
        method: 'get',
        params: { currPage, limit, resourceCategoryId, resourceName }
    })
    data.data.records.forEach(item => {
        if (!item.resourceLogo || item.resourceLogo.indexOf('http') == -1)
            item.resourceLogo = RESOURCE.DEFAULT_LINK
    })
    return data
}
/**
 * 管理员根据条件查找资源信息
 * @param {Object} param0 查找条件
 */
export async function adminGetAllResource({ currPage, limit, resourceCategoryId, resourceName, status, type } = {}) {
    const { data } = await request({
        url: 'resources/page',
        method: 'get',
        params: { currPage, limit, resourceCategoryId, resourceName, status, type }
    })
    data.data.records.forEach(item => {
        if (!item.resourceLogo || item.resourceLogo.indexOf('http') == -1)
            item.resourceLogo = RESOURCE.DEFAULT_LINK
    })
    return data
}
/**
 * 根据id查找资源
 * @param {Number} id 
 */
export async function getResourceById(id) {
    const { data } = await request({
        url: `resources/${id}`,
        method: 'get'
    })
    return data
}

export async function saveResourceInfo({ author, description, fileKey, resourceCategoryID, resourceLogo, resourceName, status, type } = {}) {
    const { data } = await request({
        url: `resources/`,
        method: 'post',
        data: { author, description, fileKey, resourceCategoryID, resourceLogo, resourceName, status, type }
    })
    return data
}
/**
 * 修改资源信息
 * @param {Number} id 
 * @param {Object} param1 
 */
export async function updateResource(id, { author, description, resourceCategoryID, resourceLogo, resourceName } = {}) {
    const { data } = await request({
        url: `resources/${id}`,
        method: 'put',
        data: { author, description, resourceCategoryID, resourceLogo, resourceName }
    })
    return data
}
/**
 * 修改资源可下载状态
 * @param {Number} id 
 * @param {Boolean} status 
 */
export async function updateResourceStatus(id, status) {
    const { data } = await request({
        url: `resources/${id}/status`,
        method: 'put',
        params: { status }
    })
    return data
}

/**
 * 批量删除资源
 * @param {Array} ids 
 */
export async function deleteResource(ids) {
    const { data } = await request({
        url: `resources/`,
        method: 'delete',
        data: ids
    })
    return data
}
/**
 * 通过资源id下载资源
 * @param {Number} id 
 */
export async function download(id) {
    const { data } = await request({
        url: `resources/download/${id}`,
        method: 'get'
    })
    return data
}
/**
 * 获取上传资源的token
 * @param {String} fileKey 
 */
export async function getDownloadToken(fileKey) {
    const { data } = await request({
        url: `resources/token`,
        method: 'get',
        params: { fileKey }
    })
    return data
}


/**
 * 取消上传
 * @param {String} key 
 * @param {Number} type 
 */
export async function cancelUpload({ key, type }) {
    const { data } = await request({
        url: `resources/cancel`,
        method: 'delete',
        params: { key, type }
    })
    return data
}