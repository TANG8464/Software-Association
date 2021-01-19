import request from "@/utils/request";

/**
 * 添加成员
 * @param {Object} param0 添加成员的成员信息
 */
export async function addMember({ address, avatarUrl, cardID, classID, customBackground, description, education, email, flag, gender, memberName, nation, nativePlace, phoneNum, politicalOutlook, positionID, qq, startYear, stu_num } = {}) {
    const { data } = await request({
        url: `member/`,
        method: 'post',
        data: { address, avatarUrl, cardID, classID, customBackground, description, education, email, flag, gender, memberName, nation, nativePlace, phoneNum, politicalOutlook, positionID, qq, startYear, stu_num }
    })
    return data
}
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
 * 修改成员状态
 * @param {Number} id 
 * @param {Number} status 
 */
export async function updateMemberStatus(id, status) {
    const { data } = await request({
        url: `/member/${id}/flag/${status}`,
        method: 'put'
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
/**
 * 下载成员导入的模板
 */
export async function downloadMemExportTemplates() {
    const { data } = await request({
        url: 'member/downloadMemExportTemplates',
        method: 'get',
        responseType: 'blob'
    })
    return data
}
/**
 * 删除成员
 * @param {Array} ids 
 */
export async function deleteMember(ids) {
    const { data } = await request({
        url: 'member/',
        method: 'delete',
        data: ids
    })
    return data
}

/**
 * 上传头像
 */
export async function avatarUpload(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await request({
        url: 'member/avatarUpload',
        method: 'post',
        data: formData
    })
    return data
}