<template>
  <view>
    <u-loading-page v-if="modalType == 'Loading'" :loading="loading" bg-color="#B2B2B2e0" :color="primaryColor" :loadingColor="primaryColor" v-bind="loadingParams"></u-loading-page>
    <u-toast v-else-if="modalType == 'Toast'" ref="uToast" />
    <u-notify v-else-if="modalType == 'Notify'" :message="content" ref="uNotify"></u-notify>
    <u-modal
      v-else-if="modalType == 'Modal'"
      :show="show"
      :content="content"
      v-bind="modalAttr"
      @cancel="modalEvent(0)"
      @confirm="modalEvent(1)"
      @close="modalEvent(-1)"
    ></u-modal>
  </view>
</template>

<script>
export default {
  name: 'MessageModal',
  data() {
    return {
      loading: false,
      show: true,
      modalType: '',
      content: '',
      callback: null,
      loadingParams: {
        loadingText: '加载中',
        loadingMode: 'spinner',
        iconSize: '34',
      },
      modalAttr: {
        showConfirmButton: true,
        showCancelButton: true,
      },
      timer: null, // loading显示的计时器
      loadingSeconds: 0, // 已经loading的秒数
      loadingTextList: ['奋力加载中', '疯狂加载中', '拼命加载中', '要炸了'],
    }
  },
  watch: {
    loadingSeconds(newVal) {
      if (newVal == 0) {
        this.$set(this.loadingParams, 'loadingText', '加载中')
      } else if (newVal >= 5) {
        const index = parseInt(this.loadingSeconds / 5) - 1
        this.$set(this.loadingParams, 'loadingText', index >= this.loadingTextList.length ? _.last(this.loadingTextList) : this.loadingTextList[index])
      }
    },
  },
  methods: {
    // 根据类型获取对应的动态颜色值
    getColorByType(type = 'primary') {
      let result = this.primaryColor
      const typeName = type.toUpperCase()
      switch (typeName) {
        case 'ERROR':
          result = this.errorColor
          break
        case 'SUCCESS':
          result = this.successColor
          break
        case 'WARNING':
          result = this.warnColor
          break
        case 'INFO':
          result = this.infoColor
          break
        default:
          result = this.primaryColor
          break
      }
      return result
    },
    showModal(type, data, callback = null) {
      this.modalType = type
      const param = _.cloneDeep(data)
      setTimeout(() => {
        switch (this.modalType) {
          case 'Loading':
            this.loading = data.Status
            delete param.Status
            this.loadingParams = { ...this.loadingParams, ...param }
            // 当没自定义loading文本的时候，开启动态加载文本
            if (data.Status && !param.loadingText) {
              this.timer = setInterval(() => {
                this.loadingSeconds++
              }, 1000)
            } else {
              clearInterval(this.timer)
              setTimeout(() => {
                this.loadingSeconds = 0
              }, 500)
            }
            break
          case 'Toast':
            this.$refs.uToast.show(data)
            break
          case 'Modal':
            this.content = data.message
            this.modalAttr = { ...this.modalAttr, ...data }
            this.callback = callback
            this.show = true
            break
          case 'Notify':
            delete param.content
            delete param.type
            this.$refs.uNotify.show({
              message: data.content,
              duration: 4000,
              bgColor: param.bgColor ? param.bgColor : this.getColorByType(data.type),
              ...param,
            })
            break

          default:
            break
        }
      }, 0)
    },
    modalEvent(type) {
      console.log(type)
      this.$emit('modalAction', type)
      this.callback(type)
      this.show = false
    },
  },
}
</script>
