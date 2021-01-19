import request from "@/utils/request"

/**
 * 提交入会申请
 * @param {Object} param0 申请入会信息 
 */
export async function uploadApply({ cardID, classID, phoneNum, stu_num, apply } = {}) {
    const formData = new FormData()
    formData.append('apply', apply)
    const { data } = await request({
        url: `upload/local/apply`,
        method: 'post',
        data: formData,
        params: { cardID, classID, phoneNum, stu_num, apply }
    })
    return data
}
/**
 * 查询自己的上传的申请书
 */
export async function searchMyApply() {
    const { data } = await request({
        url: `download/local/apply`,
        method: 'get',
    })
    return data
}

/**
 * 删除自己上传的申请书
 */
export async function deleteMyApply() {
    const { data } = await request({
        url: `delete/local/apply`,
        method: 'delete',
    })
    return data
}
/**
 * 下载自己上传的申请书
 */
export async function downloadApply() {
    const { data } = await request({
        url: `download/local/apply`,
        method: 'get',
    })
    return data
}


/**
 * 管理员查询申请文件
 * @param {Object} param0 查询的参数
 */
export async function adminSearchApply({ curPage, size, status } = {}) {
    const { data } = await request({
        url: `selApply`,
        method: 'get',
        params: { curPage, size, status }
    })
    return data
}
/**
 * 管理员修改申请书状态
 * @param {Number} afterStatus 后状态
 * @param {Number} beforeStatus 前状态
 * @param {Number} id 申请书id
 * @param {Number} memberId 审核通过时传入被审核成员id 便于更改成员角色
 */
export async function adminUpdateApply({ afterStatus, beforeStatus, id, memberId }) {
    const { data } = await request({
        url: `applyStatus`,
        method: 'put',
        params: { afterStatus, beforeStatus, id, memberId }
    })
    return data
}
/**
 * 开启申请书提交
 * @param {Number} day 设置开始时长
 */
export async function adminOpenApply(day) {
    const { data } = await request({
        url: `openApply`,
        method: 'post',
        params: { day }
    })
    return data
}
/**
 * 关闭申请书提交
 */
export async function adminCloseApply() {
    const { data } = await request({
        url: `closeApply`,
        method: 'put'
    })
    return data
}

/**
 * 是否开启提交申请书
 */
export async function isOpenApply() {
    const { data } = await request({
        url: `ifOpenApply`,
        method: 'get'
    })
    return data
}

/**
 * 上传申请书模板
 * @param {file} apply 申请书模板文件
 */
export async function uploadApplyTemplate(apply) {
    const formData = new FormData()
    formData.append('apply', apply)
    const { data } = await request({
        url: `uploadApplyTemplate`,
        method: 'post',
        data: formData
    })
    return data
}
/**
 * 获取下载申请书模板链接
 */
export async function downloadApplyTemplate() {
    const { data } = await request({
        url: `downloadApply`,
        method: 'get'
    })
    return data
}
/**
 * 删除申请书模板
 */
export async function delApplyTemplate() {
    const { data } = await request({
        url: `delApplyTemplate`,
        method: 'delete'
    })
    return data
}

/**
 * 删除所有申请书的状态缓存
 */
export async function delStatus() {
    const { data } = await request({
        url: `delStatus`,
        method: 'get'
    })
    return data
}
/**
 * 剩余多少天关闭申请书提交(-1为未开启)
 */
export async function remainTime(){
    const { data } = await request({
        url: `remainTime`,
        method: 'get'
    })
    return data
}