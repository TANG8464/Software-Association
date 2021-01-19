import request from "@/utils/request";
/**
 * 传入父类型获取子类型
 * @param {String} categoryId 
 */
export async function getAllCategory(categoryId) {
    let { data } = await request({
        url: 'book/categorise',
        method: 'get',
        params: { categoryId }
    })
    if (data.data) data.data.forEach(item => {
        item.name = item.bookCategoryName
    })
    return data
}

/**
 * 添加书籍分类
 * @param {Object}} param0 
 */
export async function addBookCategory({ bookCategoryName, categoryID, id, remark } = {}) {
    const { data } = await request({
        url: 'book/category',
        method: 'post',
        data: { bookCategoryName, categoryID, id, remark }
    })
    return data
}
/**
 * 删除书籍分类
 * @param {String} categoryId 
 */
export async function deleteBookCategory(categoryId) {
    const { data } = await request({
        url: `book/category/${categoryId}`,
        method: 'delete'
    })
    return data
}