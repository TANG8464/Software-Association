import request from "@/utils/request"

/**
 * 管理员分页查找轮播图
 * @param {Number} curPage 
 * @param {Number} limit 
 * @param {Boolean} status 
 */
export async function adminSearchCarousel(curPage, limit, status) {
    const { data } = await request({
        url: `carousel/card/page`,
        method: 'get',
        params: { curPage, limit, status }
    })
    return data
    
}
/**
 * 分页查找轮播图
 * @param {Number} curPage 
 * @param {Number} limit 
 */
export async function searchCarousel(curPage, limit) {
    const { data } = await request({
        url: `carousel/card/re/page`,
        method: 'get',
        params: { curPage, limit }
    })
    return data
}

/**
 * 修改轮播图状态
 * @param {Number} id 
 * @param {Boolean} status 
 */
export async function updateCarouselStatus(id, status) {
    const { data } = await request({
        url: `carousel/card/${id}/${status}`,
        method: 'put'
    })
    return data
}
/**
 * 修改轮播图顺序
 * @param {Array} ids 
 */
export async function updateCarouselSort(ids) {
    const { data } = await request({
        url: `carousel/card/sort`,
        method: 'put',
        data:ids
    })
    return data
}
/**
 * 批量删除轮播图
 * @param {Array} names 
 */
export async function deleteCarousel(names) {
    const { data } = await request({
        url: `carousel/card/`,
        method: 'delete',
        data: names
    })
    return data
}
/**
 * 批量添加轮播图
 * @param {Object} pictures 
 */
export async function addCarousel(pictures) {
    const formData=new FormData()
    pictures.forEach(element => {
        formData.append('pictures',element)
    });
    const { data } = await request({
        url: `carousel/card/`,
        method: 'post',
        data: formData
    })
    return data
}