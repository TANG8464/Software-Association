import request from "@/utils/request";
/**
 * 获取所有职位
 * @param {Number} currPage 
 * @param {String} limit 
 * @param {String} positionName 
 */
export async function getAllPosition(currPage, limit, positionName) {
    const { data } = await request({
        url: 'member/position/page',
        method: 'get',
        params: { currPage, limit, positionName }
    })
    data.data.records.forEach(item => {
        item.label = item.positionName
        item.value = item.id
    })
    return data
}

/**
 * 根据id查找职位
 * @param {Number} id 
 */
export async function searchPositionById(id) {
    const { data } = await request({
        url: `member/position/${id}`,
        method: 'get'
    })
    return data
}

/**
 * 添加职位
 * @param {Object} param0 职位信息
 */
export async function addPosition({ id, positionName, remark } = {}) {
    const { data } = await request({
        url: 'member/position/',
        method: 'post',
        data: { id, positionName, remark }
    })
    return data
}

/**
 * 修改职位
 * @param {Object} param0 职位信息
 */
export async function updatePosition({ id, positionName, remark } = {}) {
    const { data } = await request({
        url: 'member/position/',
        method: 'put',
        data: { id, positionName, remark }
    })
    return data
}
/**
 * 批量删除职位
 * @param {Array} ids 
 */
export async function deletePosition(ids) {
    const { data } = await request({
        url: 'member/position/',
        method: 'delete',
        data: ids
    })
    return data
}