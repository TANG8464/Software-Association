 /**
  * //字节型文件大小转换为可视化的文件大小
  * @param {number} fileSize 
  */
 export function fileSizeFormatter(fileSize) {
     const s = [
         { unit: 'TB', size: Math.pow(1024, 4) },
         { unit: 'GB', size: Math.pow(1024, 3) },
         { unit: 'MB', size: Math.pow(1024, 2) },
         { unit: 'KB', size: Math.pow(1024, 1) },
         { unit: 'B', size: Math.pow(1024, 0) },
     ]
     for (let i = 0; i < s.length; i++) {
         if (fileSize > s.size) {
             return (fileSize / s.size).toFixed(2) + s.unit;
         }
     }
 }

 export function dataFormatter(val) {
     const date = new Date(val)

     const newDate = new Date()
     const difference = newDate.getTime() - date.getTime()
     const timeMap = [
         { plus: 60, num: 1000, value: '秒' },
         { plus: 60, num: 60 * 1000, value: '分钟' },
         { plus: 24, num: 60 * 60 * 1000, value: '小时' },
     ]
     for (let item of timeMap) {
         if (difference < item.num * item.plus) {
             return Math.floor(difference / item.num) + item.value + '前'
         }
     }

     const YearAreEqual = date.getFullYear() === newDate.getFullYear()
     const MonthAreEqual = date.getMonth() === newDate.getMonth()
     const dateDay = date.getDate()
     const newDateDay = newDate.getDate()
     const day = date.toLocaleTimeString()
     if (YearAreEqual && MonthAreEqual && dateDay === newDateDay) {
         return `今天  ${day}`
     } else if (YearAreEqual && MonthAreEqual && dateDay + 1 === newDateDay) {
         return `昨天  ${day}`
     }
     return `${date.toLocaleDateString()}  ${day}`
 }
 export function countFormatter(val) {
     if (val < 1000) {
         return val
     } else if (val < 10000) {
         return val > 1100 ? (val / 1000).toFixed(1) + 'k' : (val / 1000).toFixed(0) + 'k'
     } else {
         return val > 11000 ? (val / 10000).toFixed(1) + 'w' : (val / 10000).toFixed(0) + 'w'
     }
 }