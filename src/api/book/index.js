import { BOOK } from '../constant'
import request from "@/utils/request";
/**
 * 获取所有书籍
 * @param {String} author 
 * @param {Number} bookCategoryID 
 * @param {String} bookName 
 * @param {Number} curPage 
 * @param {Number} flag 
 * @param {Number} size 
 */
export async function getAllBooks({ author, bookCategoryID, bookName, curPage, flag, size } = {}) {
    let { data } = await request({
        url: 'book/search',
        method: 'get',
        params: { author, bookCategoryID, bookName, curPage, flag, size }
    })

    if (data.data)
        data.data.records.forEach(item => {
            item.imageUrl = item.imageUrl || BOOK.DEFAULT_LINK
            item = Object.assign(item, BOOK.TAG_MAP[item.flag])
        })
    return data
}


export async function deleteBook(ids) {
    const { data } = await request({
        url: 'book/',
        method: 'delete',
        data: ids
    })
    return data
}
/**
 * 添加书籍
 * @param {Object} param0 
 */
export async function addBook({ author, bookCategoryID, bookName, count, flag, imageUrl, isbn, price, remark } = {}) {
    const { data } = await request({
        url: 'book/',
        method: 'post',
        data: { author, bookCategoryID, bookName, count, flag, imageUrl, isbn, price, remark }
    })
    return data
}