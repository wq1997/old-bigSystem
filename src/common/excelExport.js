import axios from 'axios';
import Vue from 'vue'

/**
 * 根据后端返回的文件流转为excel导出
 * @param {Object} data
 */
export function exportExcelMethod(data) {
  axios({
    method: data.method,
    url: `${data.url}?plantId=${data.params.plantId}&date=${data.params.date}&type=${data.params.type}`,
    responseType: 'blob',
    headers: {
      token: data.token
    },
    timeout: 8000,
    // params: data.data
  })
    .then((res) => {
      const link = document.createElement('a')
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)

      //判断是否IE浏览器
      function isIE() {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          return true
        } else {
          return false
        }
      }
      if (data.fileName) {
        link.download = data.fileName //下载的文件名
      } else {
        const fileName = decodeURI(
          res.headers['content-disposition'].split('=')[1]
        )
        link.download = fileName
      }
      if (isIE()) {
        // 兼容ie
        window.navigator.msSaveOrOpenBlob(blob, link.download)
      } else {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      Vue.prototype.$message.success('导出成功！')
    })
    .catch((error) => {
      Vue.prototype.$message.error('参数错误！')
    })
}
