import request from "@/utils/request"
/**
 * 添加导航栏菜单
 * @param {Object} param0 //菜单参数 
 */
export async function addMenuNav({ icon, name, orderNum, parentId, perms, status, type, url } = {}) {
    const { data } = await request({
        url: `sys/menu/`,
        method: 'post',
        data: { icon, name, orderNum, parentId, perms, status, type, url }
    })
    return data
}

/**
 * 修改导航栏菜单
 * @param {Number} id 
 * @param {Object} param1 
 */
export async function updateMenuNav(id, { icon, name, orderNum, parentId, perms, status, type, url } = {}) {
    const { data } = await request({
        url: `sys/menu/${id}`,
        method: 'put',
        data: { icon, name, orderNum, parentId, perms, status, type, url }
    })
    return data
}

/**
 * 修改导航栏菜单状态
 * @param {Number} id //菜单id
 * @param {Boolean} status //菜单状态
 */
export async function updateMenuNavStatus(id, status) {
    const { data } = await request({
        url: `sys/menu/${id}/status`,
        method: 'put',
        params: { status }
    })
    return data
}

/**
 * 根据id获取导航栏信息
 * @param {Number} menuId 
 */
export async function searchMenuById(menuId) {
    const { data } = await request({
        url: `sys/menu/${menuId}`,
        method: 'get'
    })
    return data
}

/**
 * 删除导航栏
 * @param {Number} menuId 
 */
export async function deleteMenuNav(menuId) {
    const { data } = await request({
        url: `sys/menu/${menuId}`,
        method: 'delete'
    })
    return data
}

/**
 * 获取导航菜单
 */
export async function getAllMenuNav() {
    const { data } = await request({
        url: `sys/menu/nav`,
        method: 'get'
    })
    return data
}
/**
 * 获取分配权限菜单列表
 */
export async function getAllMenuNavTree() {
    const { data } = await request({
        url: `sys/menu/tree/list`,
        method: 'get'
    })
    return data
}