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