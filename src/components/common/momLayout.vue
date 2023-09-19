<template>
  <view :class="[themeName, 'app-content']">
    <view class="content">
      <slot></slot>
    </view>
    <message-modal ref="messageModal"></message-modal>
  </view>
</template>

<script>
export default {
  methods: {
    showToast(data) {
      this.$refs.messageModal.showModal('Toast', data)
    },
    showAlert(data, callback = null) {
      this.$refs.messageModal.showModal('Modal', data, callback)
    },
    showNotify(data) {
      this.$refs.messageModal.showModal('Notify', data)
    },
    showLoading(data) {
      this.$refs.messageModal.showModal('Loading', { ...data, Status: true })
    },
    hideLoading(data) {
      this.$refs.messageModal.showModal('Loading', { ...data, Status: false })
    },
  },
}
</script>
