import request from "@/utils/request"

/**
 * 获取资源分类
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 * @param {String} resourceCategoryName 资源名称
 */
export async function getResourceCategory({ currPage, limit, resourceCategoryName, flag } = {}) {
    const { data } = await request({
        url: 'resocategory/page',
        method: 'get',
        params: { currPage, limit, resourceCategoryName, flag }
    })
    if (data.data) data.data.records.forEach(item => {
        item.name = item.resourceCategoryName
    })
    return data
}

/**
 * 添加资源类别
 * @param {Object} param0 
 */
export async function addResourceCategory({ remark, resourceCategoryName } = {}) {
    const { data } = await request({
        url: 'resocategory/',
        method: 'post',
        data: { remark, resourceCategoryName }
    })
    return data
}

/**
 * 修改资源类别
 * @param {Object} param0 
 */
export async function updateResourceCategory({ id, remark, resourceCategoryName } = {}) {
    const { data } = await request({
        url: 'resocategory/',
        method: 'put',
        data: { id, remark, resourceCategoryName }
    })
    return data
}

/**
 * 批量删除id
 * @param {Array} ids 
 */
export async function deleteResourceCategory(ids) {
    const { data } = await request({
        url: 'resocategory/',
        method: 'delete',
        data: ids
    })
    return data
}