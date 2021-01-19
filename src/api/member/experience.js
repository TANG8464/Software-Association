import request from "@/utils/request"

/**
 * 获取成员经历信息
 * @param {Number} memberId 
 */
export async function searchMemberExperience(memberId) {
    const { data } = await request({
        url: `experience/${memberId}`,
        method: 'get'
    })
    return data
}


/**
 * 添加成员经历
 * @param {Object} param0 
 */
export async function addMemberExperience({ categoryID, experienceDes, id, memberID, remark } = {}) {
    const { data } = await request({
        url: `experience/`,
        method: 'post',
        data: { categoryID, experienceDes, id, memberID, remark }
    })
    return data
}

/**
 * 删除成员经历
 * @param {Number} id 
 */
export async function deleteMemberExperience(id) {
    const { data } = await request({
        url: `experience/${id}`,
        method: 'delete'
    })
    return data
}


/**
 * 根据届数查找成员经历
 * @param {Number} year 
 */
// export async function searchMemberExperienceByYear(year) {
//     const { data } = await request({
//         url: `experience/curMembersExperience`,
//         method: 'get',
//         params: { year }
//     })
//     await data.data.forEach(item => {
//         Object.keys(item.experienceMap).forEach(i => {
//             let experience = ""
//             item.experienceMap[i].forEach(item => {
//                 experience += (experience ? ' ' + item.experienceDes : item.experienceDes)
//             })
//             item.experienceMap[i] = experience
//         })
//     })
//     return data
// }

/**
 * 根据届数查找成员经历
 * @param {Number} year 
 */
export async function searchMemberExperienceByYear(year) {
    const { data } = await request({
        url: `/member/recMemIntroduce`,
        method: 'get',
        params: { currPage: 1, limit: 99999, year }
    })
    await data.data.records.forEach(item => {
        item.year = year
        item.experienceMap = []
        Object.keys(item.experiences).forEach(i => {
            item.experienceMap.push(i + ':' + item.experiences[i].join(','))
        })
        item.experiences=item.experienceMap.join(' ')
    })
    return data
}