<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    this.$loadLanguageAsync()
  },
  onShow: function () {
    console.log('App Show')
    // 刷新页面更新用户信息
    const token = uni.getStorageSync('token')
    if (token) {
      this.$store.dispatch('$GetInfo')
    }
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni.scss';
@import '@/style/common/theme.scss';
@import 'uview-ui/index.scss';
@import '@/style/common/colorui.css';
page {
  height: 100%;
}
.app-content {
  height: 100%;
  justify-content: flex-start;
}
</style>
