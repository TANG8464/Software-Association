
export function encryption(str) {//URL编码+字符串编码
    return window.btoa(encodeURIComponent(str + ""))
}
export function decryption(str) {//字符串解码+URL编码
    const strD = decodeURIComponent(window.atob(str))
    if (typeof strD === 'number') return Number(strD)
    return strD
}

//将form中的字符串对象加密
export async function encryptionObj(obj) {
    await Object.keys(obj).forEach((item) => {
        if (typeof obj[item] === 'string') obj[item] = encryption(obj[item])
        else if (typeof obj[item] === 'object') encryptionObj(obj[item])
    })
    return obj
}
//将form中的字符串对象解密
export async function decryptionObj(obj) {
    await Object.keys(obj).forEach((item) => {
        if (typeof obj[item] === 'string') obj[item] = decryption(obj[item])
        else if (typeof obj[item] === 'object') decryptionObj(obj[item])
    })
    return obj
}