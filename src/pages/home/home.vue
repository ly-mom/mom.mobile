<template>
  <mom-layout ref="momLayout">
    <template>
      <image class="logo" src="/static/logo.png"></image>
      <view>
        <text class="title" @click="login">home2222222</text>
        <text class="title">{{ title }}</text>
        <text class="title">{{ title }}</text>
      </view>
      <view><text class="title" @click="changeLan">change</text></view>
    </template>
  </mom-layout>
</template>

<script>
import { GetLangResource, SubmitLogin } from '@/api/system'
export default {
  data() {
    return {
      title: 'home',
      show: false,
    }
  },
  onLoad() {},
  methods: {
    async login() {
      // this.$store.dispatch('$Login', {
      //   loginForm: { userCode: '10419421', password: 'qms.123456' },
      // })
      this.mom.showAlert(
        {
          message: '登录成功',
          type: 'success',
          showCancelButton: true,
        },
        res => {
          console.log(res)
        },
      )
      // GetLangResource({})
      // let res = await SubmitLogin({"userCode": "10419421","password": "qms.123456"})
      // console.log("res");
      // console.log(res);
    },
    changeLan() {
      // this.$loadLanguageAsync('en-US')
      // this.$mom.showToast({
      // 	message: '登录成a 功',
      // 	content: '登录成功',
      // 	type: 'success'
      // })

      // this.$mom.showLoading()
      // setTimeout(() => {
      // 	this.$mom.hideLoading()
      // }, 2000);
      // this.$mom.showNotify({
      // 	message: '登录成a 功',
      // 	content: '登录成功',
      // 	type: 'success'
      // })
      this.$mom.showAlert({
        message: '登录成a 功',
        content: '登录成功',
        type: 'success',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
