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
     const YearAreEqual = date.getFullYear() === newDate.getFullYear()
     const MonthAreEqual = date.getMonth() === newDate.getMonth()
     const dateDay = date.getDate()
     const newDateDay = newDate.getDate()
     const week = ['日', '一', '二', '三', '四', '五', '六']
     const day = `星期${week[date.getDay()]}`
     if (YearAreEqual && MonthAreEqual && dateDay === newDateDay) {
         return `今天  ${day}`
     } else if (YearAreEqual && MonthAreEqual && dateDay + 1 === newDateDay) {
         return `昨天  ${day}`
     }
     return `${val}  ${day}`
 }