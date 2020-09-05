import request from "@/utils/request";
const link = "https://siaestudio.cn-bj.ufileos.com/55023cd8-9915-4f4e-a41c-05a43052993a.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=pUp9PKtuypDWa0LcS54Coi6nIEI%3D&Expires=2858490464"
const tagMap = [
    { tagLabel: '在库', tagType: '' },
    { tagLabel: '空缺', tagType: 'danger' },
    { tagLabel: '遗失', tagType: 'info' },
]

/**
 * 
 * @param {String} author 
 * @param {Number} bookCategoryID 
 * @param {String} bookName 
 * @param {Number} curPage 
 * @param {Number} flag 
 * @param {Number} size 
 */
export async function getAllBooks(author, bookCategoryID, bookName, curPage, flag, size) {
    let { data } = await request({
        url: 'book/search',
        method: 'get',
        params: { author, bookCategoryID, bookName, curPage, flag, size }
    })

    if (data.data)
        data.data.records.forEach(item => {
            item.imageUrl = item.imageUrl || link
            item = Object.assign(item, tagMap[item.flag])
        })
    return data
}

export async function getAllSort() {
    let { data } = await request({
        url: 'book/categorise',
        method: 'get'
    })
    data.data.forEach(item => {
        item.name = item.bookCategoryName
    })
    return data
}
/**
 * 
 * @param {Number} bookID 书籍id
 * @param {Number} memberID 用户id
 */
export async function bookBorrow(bookID, memberID) {
    const { data } = await request({
        url: 'bookborrow/borrow',
        method: 'post',
        data: { bookID, memberID }
    })
    return data
}
export async function bookReturn(id) {
    const { data } = await request({
        url: 'bookborrow/return?id=' + id,
        method: 'post'
    })
    return data
}

/**
 * 
 * @param {String} bookName 书籍名称
 * @param {Number} curPage 当前页
 * @param {Number} endDay 截止日期，查询某个时间段借书记录 时间戳
 * @param {Number} flag 0 全部（默认），1 已归还，2 未归还, 3 逾期
 * @param {Number} memberId 成员用户名
 * @param {String} memberName 成员姓名
 * @param {Number} size 每页多少条数据
 * @param {Number} startDay 开始日期，查询某个时间段借书记录 时间戳
 */
export async function borrowSearch(bookName, curPage, endDay, flag, memberId, memberName, size, startDay) {
    let { data } = await request({
        url: 'bookborrow/search',
        method: 'get',
        params: { bookName, curPage, endDay, flag, memberId, memberName, size, startDay }
    })
    if (data.data)
        data.data.records.forEach(item => {
            item.book.imageUrl = item.book.imageUrl || link
            item.book = Object.assign(item.book, tagMap[item.book.flag])
        })
    console.log(data);
    return data
}