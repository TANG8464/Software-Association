import { BOOK } from '../constant'
import request from "@/utils/request";
/**
 * 书籍借阅
 * @param {Number} bookID 书籍id
 * @param {Number} memberID 用户id
 */
export async function bookBorrow({ bookID, memberID, remark } = {}) {
    const { data } = await request({
        url: 'bookborrow/borrow',
        method: 'post',
        data: { bookID, memberID, remark }
    })
    return data
}

export async function memberBookBorrow({ bookId } = {}) {
    const { data } = await request({
        url: 'bookborrow/memberBorrow',
        method: 'post',
        params: { bookId }
    })
    return data
}
/**
 * 还书
 * @param {String} id 
 */
export async function bookReturn(id) {
    const { data } = await request({
        url: 'bookborrow/return?id=' + id,
        method: 'post'
    })
    return data
}

/**
 * 被借书籍查询
 * @param {String} bookName 书籍名称
 * @param {Number} curPage 当前页
 * @param {Number} endDay 截止日期，查询某个时间段借书记录 时间戳
 * @param {Number} flag 0 全部（默认），1 已归还，2 未归还, 3 逾期
 * @param {Number} memberId 成员用户名
 * @param {String} memberName 成员姓名
 * @param {Number} size 每页多少条数据
 * @param {Number} startDay 开始日期，查询某个时间段借书记录 时间戳
 */
export async function borrowSearch({ bookName, curPage, endDay, flag, memberId, memberName, size, startDay } = {}) {
    let { data } = await request({
        url: 'bookborrow/search',
        method: 'get',
        params: { bookName, curPage, endDay, flag, memberId, memberName, size, startDay }
    })
    if (data.data)
        data.data.records.forEach(item => {
            item.book.imageUrl = item.book.imageUrl || BOOK.DEFAULT_LINK
            item.book = Object.assign(item.book, BOOK.TAG_MAP[item.book.flag])
        })
    return data
}


/**
 * 获取书籍借出次数
 * @param {Number} startDay 开始时间
 * @param {Number} endDay 结束时间
 */
export async function borrowCount(startDay, endDay) {
    const { data } = await request({
        url: 'bookborrow/loanCount',
        method: 'get',
        params: { startDay, endDay }
    })
    return data
}