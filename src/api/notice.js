import request from "@/utils/request";

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
    })
    return data
}