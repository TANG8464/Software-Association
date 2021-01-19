import request from "@/utils/request"
/**
 * 新增角色
 * @param {Object} param0 角色信息
 */
export async function addRole({ roleName, remark } = {}) {
    const { data } = await request({
        url: `sys/role/`,
        method: 'post',
        data: { roleName, remark }
    })
    return data
}

/**
 * 批量删除角色
 * @param {Array} roles 
 */
export async function deleteRole(roles) {
    const { data } = await request({
        url: `sys/role/`,
        method: 'delete',
        data: roles
    })
    return data
}

/**
 * 根据角色id查找角色
 * @param {Number} roleId 
 */
export async function searchRoleById(roleId) {
    const { data } = await request({
        url: `sys/role/${roleId}`,
        method: 'get'
    })
    return data
}


/**
 * 修改role
 * @param {Number} roleId 
 * @param {Object} param1 
 */
export async function updateRole(roleId, { roleName, remark } = {}) {
    const { data } = await request({
        url: `sys/role/${roleId}`,
        method: 'put',
        data: { roleName, remark }
    })
    return data
}


/**
 * 角色权限分配
 * @param {Number} roleId 角色id
 * @param {Array} menuIds 菜单id（菜单绑定了权限）
 */
export async function permissionAssignment(roleId, menuIds) {
    const { data } = await request({
        url: `sys/role/${roleId}/menu`,
        method: 'put',
        data: menuIds
    })
    return data
}


/**
 * 根据条件查询角色
 * @param {Object} param0 
 */
export async function searchAllRole({ currPage, limit, roleName } = {}) {
    const { data } = await request({
        url: `sys/role/page`,
        method: 'get',
        params: { currPage, limit, roleName }
    })
    return data
}