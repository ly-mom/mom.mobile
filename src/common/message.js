export const message = {
  // 显示消息提示
  toast: function (title, icon = 'none', duration = 2000) {
    if (!title) return
    uni.showToast({
      title: title,
      icon: icon,
      mask: true,
      duration: duration,
    })
  },
  // 显示加载框
  showLoading: function (title = '') {
    if (!title) return
    uni.showLoading({
      title: title,
      mask: true,
    })
  },
  // 隐藏加载框
  hideLoading: function () {
    uni.hideLoading()
  },
  // 显示消息弹窗
  alert: function (title = '', content) {
    if (!content) return
    uni.showModal({
      title: title,
      content: content,
      showCancel: false,
    })
  },
  // 显示对话弹框
  confirm: function (title = '', content, callback) {
    uni.showModal({
      title: title,
      content: content,
      success: callback,
    })
  },
}
