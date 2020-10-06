import request from "@/utils/request"
import { sendAlEmail } from '@/api/email'

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
 * 查询所有消息
 * @param {String} action 消息类型
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 * @param {String} title 消息标题
 */
export async function searchAllMessage(action, currPage, limit, title) {
    const { data } = await request({
        url: `sys/notice/page`,
        method: 'get',
        params: { action, currPage, limit, title }
    })
    data.data.records.forEach(item => {
        item.text = formatHtml(item.content)
    })
    return data
}


/**
 * 管理员发送消息
 * @param {Object} param0 
 */
export async function adminSendMsg({ action, content, title, userIds }) {
    const { data } = await request({
        url: `sys/notice/sender`,
        method: 'post',
        data: { action, content, title, userIds }
    })
    if (data.code === 200) {
        const data = await sendAlEmail(content, userIds, title)
        return data
    }
    return data
}
/**
 * 管理员修改消息
 * @param {Object} param0 消息参数
 */
export async function adminUpdateMsg({ id, action, content, title }) {
    const { data } = await request({
        url: `sys/notice/info/${id}`,
        method: 'put',
        data: { action, content, title }
    })
    return data
}
/**
 * 管理员删除消息
 * @param {Array} ids 
 */
export async function adminDeleteMsg(ids) {
    const { data } = await request({
        url: `sys/notice/info`,
        method: 'delete',
        data: ids
    })
    return data
}


/**
 * 查找自己的消息
 * @param {String} action 消息类型
 * @param {Number} currPage 当前页
 * @param {Number} limit 每页条数
 * @param {String} title 消息标题
 */

export async function searchMessage(action, currPage, limit, title) {
    const { data } = await request({
        url: `sys/notice/person`,
        method: 'get',
        params: { action, currPage, limit, title }
    })
    data.data.records.forEach(item => {
        item.text = formatHtml(item.content)
    })
    return data
}

/**
 * 修改消息为已读
 * @param {String} noticeId 消息id
 */

export async function updateMsgToRead(noticeId) {
    const { data } = await request({
        url: `sys/notice/${noticeId}/status/`,
        method: 'put'
    })
    return data
}
/**
 * 用户删除自己消息
 * @param {Array} ids 
 */
export async function deleteMsg(ids) {
    const { data } = await request({
        url: `sys/notice/person`,
        method: 'delete',
        data: ids
    })
    return data
}



/**
 * 获取未读通知条数
 */
export async function getUnreadCount() {
    const { data } = await request({
        url: `sys/notice/unread/count`,
        method: 'get'
    })
    return data
}

/**
 * 关闭连接
 */
export async function closeSocket() {
    const { data } = await request({
        url: `sys/notice/person/socket`,
        method: 'delete'
    })
    return data
}