export default function imgVerify(file, type, size, error) {
    console.log(type.includes(file.type));

    const TypeVerify = type.includes(file.type)
    const isLt2M = file.size / 1024 / 1024 < size
    if (!TypeVerify) {
        return { state: false, type: 'error', message: error[0] || '' }
    } else if (!isLt2M) {
        return { state: false, type: 'error', message: error[1] || '' }
    } else return { state: true }
}