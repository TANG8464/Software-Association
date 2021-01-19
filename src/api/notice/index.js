import request from "@/utils/request";
import { NOTICE } from '../constant'
/**
 * 根据文章获取第一张图片
 * @param {String} content 文章内容 
 */
function formatImg(content) {
    let data
    content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture
    })
    return data || NOTICE.DEFAULT_LINK
}
/**
 * 根据文章的html内容 获取所有文字
 * @param {String} content 文章内容
 */

function formatHtml(content) {
    return content
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '')
        .replace(/<[^>]+?>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/ /g, ' ')
        .replace(/>/g, ' ')
}

/**
 * 
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页多少条数据
 * @param {String} title 文章标题（模糊查询）
 */
export async function searchAllNotice({ currPage, limit, title, categoryId } = {}) {
    const { data } = await request({
        url: 'news/reception',
        method: 'get',
        params: { currPage, limit, title, categoryId },
        headers: {}
    })
    const moreData = data.data ? data.data.records : []
    const tagStyle = [
        {},
        { tagType: '', tagLabel: '置顶' },
        { tagType: 'danger', tagLabel: '高级置顶' },
    ]
    moreData.forEach((item) => {
        item = Object.assign(item, tagStyle[item.top])
        item.label = item.newsLabel ? item.newsLabel.split(',') : []
        item.cover = formatImg(item.content)
        item.text = formatHtml(item.content)
    })
    return data
}
/**
 * 后台根据条件查询公告
 * @param {Object} param0 查询条件
 */
export async function adminSearchAllNotice({ currPage, limit, title, newsFlag, categoryId } = {}) {
    const { data } = await request({
        url: 'news/',
        method: 'get',
        params: { currPage, limit, title, newsFlag, categoryId }
    })
    return data
}

/**
 * 通过id查找公告
 * @param {Number} id 
 */
export async function searchNoticeById(id) {
    const { data } = await request({
        url: `news/${id}`,
        method: 'get'
    })
    let notice = data.data
    notice.cover = formatImg(notice.content)
    if (notice)
        notice.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    return data
}
/**
 * 前台根据id查找公告
 * @param {Number} id 
 */
export async function receptionSearchNoticeById(id) {
    const { data } = await request({
        url: `news/reception/${id}`,
        method: 'get',
        headers: {}
    })
    let notice = data.data
    notice.cover = formatImg(notice.content)
    if (notice)
        notice.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    return data
}


/**
 * 查找三条最新的公告
 */
export async function searchNewestNotice() {
    const { data } = await request({
        url: `news/newest`,
        method: 'get'
    })
    const notice = data.data
    notice.forEach(item => {
        item.cover = formatImg(item.content)
        item.text = formatHtml(item.content)
        item.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    })
    return data

}

/**
 * 操作公告，修改或者保存
 * @param {String} method //put 或post
 * @param {Object} param1 //公告属性
 */
export async function operatingNotice(method, { categoryId, content, flag, newsId, newsLabel, publishTime, title, top } = {}) {
    const { data } = await request({
        url: `news/`,
        method,
        data: { categoryId, content, flag, newsId, newsLabel, publishTime, title, top }
    })
    return data
}

/**
 * 批量删除公告
 * @param {Array} ids 
 */
export async function deleteNotice(ids) {
    const { data } = await request({
        url: 'news/',
        method: 'delete',
        data: ids
    })
    return data
}


/**
 * 发布公告
 * @param {Number} id 
 */
export async function publishNotice(id) {
    const { data } = await request({
        url: `news/${id}/publish`,
        method: 'put'
    })
    return data
}