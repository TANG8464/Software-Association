import request from "@/utils/request";

/**
 * 修改成员角色
 * @param {Number} memberId 
 * @param {Array} roles 
 */
export async function updateMemberAuthority(memberId, roles) {
    const { data } = await request({
        url: `member/authority/${memberId}`,
        method: 'put',
        data: roles
    })
    return data
}