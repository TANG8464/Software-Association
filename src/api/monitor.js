import request from "@/utils/request"
/**
 * 获取书籍总数与被借阅书本数
 */
export async function getMonitorBook() {
    const { data } = await request({
        url: `monitor/book/flag`,
        method: 'get'
    })
    return data
}
/**
 * 获取成员不同状态数
 */
export async function getMonitorMember() {
    const { data } = await request({
        url: `monitor/member/flag`,
        method: 'get'
    })
    return data
}
/**
 * 不同文章状态数量
 */
export async function getMonitorNews() {
    const { data } = await request({
        url: `monitor/news/flag`,
        method: 'get'
    })
    return data
}
/**
 * 查询网站访问量
 * @param {Number} beginDate 开始时间
 * @param {Number} endDate 结束时间
 * @param {Number} limit 
 */
export async function getMonitorWebsite(beginDate, endDate, limit) {
    const { data } = await request({
        url: `monitor/website/visit`,
        method: 'get',
        params: { beginDate, endDate, limit }
    })
    return data
}
/**
 * 增加网站访问量
 */
export async function addMonitorWebsite() {
    const { data } = await request({
        url: `monitor/website/visit`,
        method: 'post'
    })
    return data
}