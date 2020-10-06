import request from "@/utils/request"
import { Base64 } from 'js-base64';
/**
 * 发送阿里邮件
 * @param {String} content 内容
 * @param {Array} receiverId 发送对象数组
 * @param {String} subject 发送标题（默认软件协会）
 */
export async function sendAlEmail(content, receiverId, subject) {
    Base64.extendString();
    const b=content.toBase64()
    const { data } = await request({
        url: `alibabaEmail`,
        method: 'post',
        data:{content:b, receiverId, subject}
    })
    return data
}
/**
 * 发送邮件
 * @param {String} content 
 * @param {Array} receiverId 
 * @param {String} subject 
 */
export async function sendEmail(content, receiverId, subject) {
    Base64.extendString();
    const b=content.toBase64()
    const { data } = await request({
        url: `commonEmail`,
        method: 'post',
        data:{b, receiverId, subject}
    })
    return data
}