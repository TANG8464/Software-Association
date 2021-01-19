import request from "@/utils/request"

/**
 * 添加成员经历分类
 * @param {Object} param0 
 */
export async function addExperienceCategory({ expCategoryName, id, remark } = {}) {
    const { data } = await request({
        url: `experience/exp-category/`,
        method: 'post',
        data: { expCategoryName, id, remark }
    })
    return data
}

/**
 * 查找所有成员经历分类
 */
export async function searchMemberExperienceCategory() {
    const { data } = await request({
        url: `experience/exp-categorise`,
        method: 'get'
    })
    data.data.forEach(item => {
        item.categoryName = item.expCategoryName
    })
    return data
}
/**
 * 删除成员经历分类
 * @param {Number} id 
 */
export async function delMemberExperienceCategory(id) {
    const { data } = await request({
        url: `experience/exp-category/${id}`,
        method: 'delete'
    })
    return data
}