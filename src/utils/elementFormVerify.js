import {
    userNameVerify,
    phoneVerify,
    cardIdVerify,
    stuNumVerify,
    emailVerify,
    pwdVerify
} from '@/utils/verify'
const validateCardID = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('身份证不能为空'))
    } else if (!cardIdVerify(value)) {
        callback(new Error('请输入正确的身份证号'))
    } else {
        callback()
    }
}
const validatePhoneNum = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('手机号不能为空'))
    } else if (!phoneVerify(value)) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }
}
const validateEmail = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('邮箱不能为空'))
    } else if (!emailVerify(value)) {
        callback(new Error('请输入正确的邮箱'))
    } else {
        callback()
    }
}
const validateStuNum = (rule, value, callback) => {
    if (!value && value != 0) {
        return callback(new Error('学号不能为空'))
    } else if (!stuNumVerify(value)) {
        callback(new Error('请输入正确的学号'))
    } else {
        callback()
    }
}
const validateMemberName = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('名称不能为空'))
    } else if (!userNameVerify(value)) {
        callback(new Error('名称只能在4-10位之间'))
    } else {
        callback()
    }
}
const validateNum = (rule, value, callback) => {
    if (value <= 0) {
        callback(new Error('必须大于0'))
    } else {
        callback()
    }
}
export default { validateCardID, validatePhoneNum, validateEmail, validateStuNum, validateMemberName, validateNum }