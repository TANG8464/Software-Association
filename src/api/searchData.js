import request from "@/utils/request"
/**
 * 通过专业获取班级
 * @param {Number} specialtyId 专业Id
 */
async function searchClass(specialtyId) {
    let data
    await request({
        url: `college/class/${specialtyId}`,
        method: 'get'
    }).then(res => {
        data = res.data.data
    })
    return data
}
/**
 * 通过院系id获取专业
 * @param {Number} instituteId 院系id
 */
async function searchSpecialty(instituteId) {
    let data
    await request({
        url: `college/specialties/${instituteId}`,
        method: 'get'
    }).then(res => {
        data = res.data.data
    })
    return data
}
/**
 * 获取所有院系
 */
async function searchInstitutes() {
    let data
    await request({
        url: 'college/institutes',
        method: 'get'
    }).then(res => {
        data = res.data.data
    })
    return data
}
/**
 * 获取级联树
 */
async function searchTree() {
    let data
    await request({
        url: '/college/tree',
        methods: 'get'
    }).then(res => {
        data = res.data.data
    })
    return data
}

/**
 * 使用Promise解决递归异步问题
 * @param {Number} ms //毫秒 
 */
const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 递归赋值
 * @param {Object} obj 需要赋值的对象 
 */
async function ra(obj) {
    if (!obj) return
    obj.forEach(async function(item) {
        item.label = item['name']
        item.value = item.id
        item.children = item.child
        await ra(item.children)
    })
}
/**
 * 获取级联班级
 */
export async function searchCascadeClass() {
    let cascadeClass = await searchTree()
    await ra(cascadeClass) //调用递归赋值
    await wait(400);
    return cascadeClass
}

/**
 * 将有子集的obj加上hasChildren = true
 * @param {Object} obj //需要操作的对象 
 * @param {Number} parentId //父级id 
 * @param {Number} type //对象类别，用于区分学院、专业与班级
 */
let index = 1
async function filter(obj, parentId, type, parentName) {
    if (!obj) return
    obj.forEach(async function(item) {
        item.isHover = false
        item.isEdit = false
        item.type = type
        item.parentId = parentId
        item.parentName = parentName
        item.tagType = item.type === 2 ? 'success' : ''
            // item.indexId = index++
        if (item.child && item.child.length !== 0) {
            // item.hasChildren = true
            let name
            if (item.type <= 0) name = item.name.substring(0, 2)
            else if (item.type <= 1) name = item.name
            await filter(item.child, item.id, type + 1, name)
        }
    })
}
export async function searchCollegeTree() {
    let cascadeClass = await searchTree()
    await filter(cascadeClass, 0, 0, '') //调用递归赋值
    await wait(400);
    return cascadeClass
}