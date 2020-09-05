import request from "@/utils/request";
const link = 'https://siaestudio.cn-bj.ufileos.com/2d42533f-2bc8-4929-89d5-7b6a2d03bb62.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=UZB50yqAUVhYZf6UyNwuXxkOhsk%3D&Expires=2858405930'

/**
 * 获取资源分类
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 * @param {String} resourceCategoryName 资源名称
 */
export async function getResourceSort(currPage, limit, resourceCategoryName) {
    const { data } = await request({
        url: 'resocategory/page',
        method: 'get',
        params: { currPage, limit, resourceCategoryName }
    })
    data.data.records.forEach(item => {
        item.name = item.resourceCategoryName
    })
    return data
}
/**
 * 获取所有资源
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
        console.log(item.resourceLogo);

        if (!item.resourceLogo || item.resourceLogo.indexOf('http') == -1)
            item.resourceLogo = link
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