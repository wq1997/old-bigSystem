export const showNotification = (plantName, sn) => {
  // 先检查浏览器是否支持
  if (!("Notification" in window)) return;

  let options = {
    body: `New alarm \nplant：${plantName}\nsn：${sn}`,
    icon: 'https://sermatec-cloud.oss-cn-hangzhou.aliyuncs.com/imgs/1589614068%281%29_2020_05_16_15_28_19_711238614696067072.jpg?Expires=1904974100&OSSAccessKeyId=LTAI4Fdt3ZMS6g6TwUKCaA87&Signature=BNnsmWsvI%2FFQ0npd9YYZ3b9UHRM%3D',
  }

  let sendNotification = _ => new Notification('', options)

  let { permission } = Notification

  // 检查用户是否同意接受通知
  if (permission === "granted") {
    sendNotification()
  }

  // 否则我们需要向用户获取权限 ,如果用户同意，就可以向他们发送通知
  if (permission === 'denied') {
    Notification.requestPermission(permission => {
      if (permission === "granted") {
        sendNotification()
      }
    })
  }

}