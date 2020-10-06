import request from "@/utils/request";
const link = 'https://siaestudio.cn-bj.ufileos.com/2d42533f-2bc8-4929-89d5-7b6a2d03bb62.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=UZB50yqAUVhYZf6UyNwuXxkOhsk%3D&Expires=2858405930'
    /**
     * 根据文章获取第一张图片
     * @param {String} content 文章内容 
     */
function formatImg(content) {
    let data
    content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function(match, capture) {
        data = capture
    })
    return data || link
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
export async function searchAllNotice(currPage, limit, title) {
    let { data } = await request({
        url: 'news/reception',
        method: 'get',
        params: { currPage, limit, title }
    })

    let moreData = data.data ? data.data.records : []
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
 * 通过id查找公告
 * @param {Number} id 
 */
export async function searchNoticeById(id) {
    let { data } = await request({
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
    let { data } = await request({
        url: `news/reception/${id}`,
        method: 'get'
    })
    let notice = data.data
    notice.cover = formatImg(notice.content)
    if (notice)
        notice.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    return data
}



export async function searchNewestNotice() {
    let { data } = await request({
        url: `news/newest`,
        method: 'get'
    })
    let notice = data.data
    notice.forEach(item => {
        item.cover = formatImg(item.content)
        item.text = formatHtml(item.content)
        item.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    })
    return data

}
export async function noticeMaxId() {
    let { data } = await request({
        url: `news/newest`,
        method: 'get'
    })
    let max = data.data[0].id
    return max
}