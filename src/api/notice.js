import request from "@/utils/request";
const link = 'https://siaestudio.cn-bj.ufileos.com/2d42533f-2bc8-4929-89d5-7b6a2d03bb62.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=UZB50yqAUVhYZf6UyNwuXxkOhsk%3D&Expires=2858405930'

function formatImg(content) {
    let data
    content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function(match, capture) {
        data = capture
    })
    return data || link
}

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
    let moreData = data.data.records
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
export async function searchNoticeById(id) {
    let { data } = await request({
        url: `news/${id}`,
        method: 'get'
    })
    let notice = data.data
    notice.label = notice.newsLabel ? notice.newsLabel.split(',') : []
    return data

}