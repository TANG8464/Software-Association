import request from "@/utils/request"

/**
 * 条件查询所有公告分类
 * @param {Object} param0 查询条件
 */
export async function searchAllNotieCategiry({ categoryName, currPage, limit } = {}) {
    const { data } = await request({
        url: `newscategory/`,
        method: 'get',
        params: { categoryName, currPage, limit }
    })
    return data
}
/**
 * 添加公告分类
 * @param {Object} param0 公告分类参数
 */
export async function addNotieCategiry({ newsCategoryName, remark } = {}) {
    const { data } = await request({
        url: `newscategory/`,
        method: 'post',
        data: { newsCategoryName, remark }
    })
    return data
}
/**
 * 批量删除公告分类
 * @param {Array} ids 公告分类id数组
 */
export async function deleteNotieCategiry(ids) {
    const { data } = await request({
        url: `newscategory/`,
        method: 'delete',
        data: ids
    })
    return data
}

/**
 * 修改公告分类
 * @param {Number} newsCategoryId 公告分类id
 * @param {Object} param1 公告分类参数
 */
export async function updateNotieCategiry(newsCategoryId, { newsCategoryName, remark } = {}) {
    const { data } = await request({
        url: `newscategory/${newsCategoryId}`,
        method: 'put',
        data: { newsCategoryName, remark }
    })
    return data
}

/**
 * 
 * 根据分类id查询公告
 * @param {Number} id 分类id
 * @param {Number} flag 公告状态(已发布，草稿，定时)
 */
export async function searchNotieByCategiry(id, flag) {
    const { data } = await request({
        url: `newscategory/category/${id}/flag/${flag}`,
        method: 'get'
    })
    return data
}