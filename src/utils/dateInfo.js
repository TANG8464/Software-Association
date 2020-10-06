function getPickerOptions() {
    return {
        shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                },
            },
            {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                },
            },
            {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                },
            },
        ],
    }
}

function getNowDate() {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    const date = nowDate.getDate()
    return `${year}年${month}月${date}日`
}
const dateInfo = {
    pickerOptions: getPickerOptions(),
    nowDate: getNowDate()
}
export default dateInfo