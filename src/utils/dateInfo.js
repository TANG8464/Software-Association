export function getPickerOptions() { //element日历快捷键数据
    return {
        shortcuts: [{
            text: '当天',
            onClick(picker) {
                const end = parseInt(
                    (new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000) / 1000
                )
                const start = parseInt(new Date(new Date().toLocaleDateString()).getTime() / 1000)
                picker.$emit('pick', [start, end])
            },
        },
        {
            text: '最近一周',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
            },
        },
        {
            text: ' 最近一月',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
            },
        },
        {
            text: '本年',
            onClick(picker) {
                const end = new Date()
                const start = new Date()
                let day
                const year = start.getFullYear
                if (year % 4 == 0 && year % 100 != 0 && year % 400 == 0) {
                    day = 366
                } else {
                    day = 365
                }
                start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
                picker.$emit('pick', [start, end])
            },
        },
        ],
    }
}

function getNowDate() { //获取当前年月日
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