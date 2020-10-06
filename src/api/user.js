import request from "@/utils/request";

/*
--------------------------职位-------------------------------
*/
/**
 * 获取所有职位
 * @param {Number} currPage 
 * @param {String} limit 
 * @param {String} positionName 
 */
export async function getPosition(currPage, limit, positionName) {
    const { data } = await request({
        url: 'member/position/page',
        method: 'get',
        params: { currPage, limit, positionName }
    })
    data.data.records.forEach(item => {
        item.label = item.positionName
        item.value = item.id
    })
    return data
}
/*
--------------------------信息-------------------------------
*/
/**
 * 修改成员信息
 * @param {Number} id 
 * @param {Object} params //修改的数据
 */
export async function updateMemberInfo(id, params) {
    const { data } = await request({
        url: `member/${id}`,
        method: 'put',
        data: params
    })
    return data
}
/**
 * 根据条件查询成员信息
 * @param {Object} params 条件查询 
 */
export async function conditionSearch(params) {
    const { data } = await request({
        url: 'member/search',
        method: 'get',
        params
    })
    return data
}
/**
 * 根据条件导出成员信息
 * @param {Object} params 条件查询
 */
export async function downloadMemberInfo(params) {
    const { data } = await request({
        url: 'member/downloadMemberInfo',
        method: 'get',
        params,
        responseType: 'blob'
    })
    return data
}
/*
--------------------------考核-------------------------------
*/
/**
 * 获取所有成绩
 * @param {*} beginTimeStamp 开始时间时间戳
 * @param {*} endTimeStamp 结束时间时间戳
 * @param {*} currPage 当前页
 * @param {*} limit 每页条数
 * @param {*} memberId 成员id
 * @param {*} memberName 成员名
 * @param {*} testName 考核名称
 */
export async function getAllScore({ beginTimeStamp, endTimeStamp, currPage, limit, memberId, memberName, testName }) {
    const { data } = await request({
        url: "score/page",
        method: 'get',
        params: { beginTimeStamp, endTimeStamp, currPage, limit, memberId, memberName, testName }
    })
    return data
}
/**
 * 添加考核信息的参数
 * @param {Object} params 
 */
export async function addScore(params) {
    const { data } = await request({
        url: "score/",
        method: 'post',
        data: params
    })
    return data
}
/**
 * 设置下载模板的连接
 */

export async function setUploadLink() {
    const { data } = await request({
        url: "score/downloadScoreExportTemplates",
        method: 'get',
        responseType: 'blob',
    })
    return data
}
/**
 * 上传批量导入考核信息的Excel
 * @param {File} file 
 */
export async function uploadScore(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await request({
        url: "score/uploadScoreExcel",
        method: 'post',
        data: formData
    })
    return data
}
/**
 * 通过条件导出成员考核信息
 * @param {Object} param0 
 */
export async function downloadScoreLog({ beginTimeStamp, endTimeStamp, currPage, limit, memberId, memberName, testName }) {
    const { data } = await request({
        url: "score/downloadLog",
        method: 'get',
        responseType: 'blob',
        params: { beginTimeStamp, endTimeStamp, currPage, limit, memberId, memberName, testName }
    })
    return data
}
/**
 * 修改考核信息
 * @param {Number} id 修改的考核信息id
 * @param {Object} params 修改的参数
 */
export async function updateScore(id, params) {
    const { data } = await request({
        url: `/score/member/${id}`,
        method: 'put',
        data: params
    })
    return data
}
/**
 * 通过id数组删除考核信息
 * @param {Array} ids 
 */
export async function deleteScore(ids) {
    const { data } = await request({
        url: `score/`,
        method: 'delete',
        data: ids
    })
    return data
}