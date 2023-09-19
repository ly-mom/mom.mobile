<template>
  <mom-layout ref="momLayout">
    <template>
      <u-notice-bar direction="column" :text="notlist" :bgColor="primaryColorLight" :color="primaryColor"></u-notice-bar>
      <image class="logo" src="/static/logo.png"></image>
      <u-icon name="photo" :color="primaryColor"></u-icon>
      <u-button text="镂空" :color="primaryColor" @click="showMessage"></u-button>
      <text class="title">{{ title }}</text>
      <text class="title">{{ $tl('IQC_ApplicantInfo', '6666') }}</text>
      <view><text class="title" @click="login">登录接口</text></view>
      <view
        ><text class="title">{{ $tl('IQC_ApplicantInfo', '6666') }}</text></view
      >
      <view><text class="title" @click="query" :style="{ color: primaryColor }">切换主题</text></view>
      <view><text class="title" @click="navNewPage">跳新页面</text></view>
      <view><text class="title" @click="changeLan">切换多语言</text></view>
      <view><text class="title" @click="envi">console</text></view>
    </template>
  </mom-layout>
</template>

<script>
import { GetLangResource, SubmitLogin } from '@/api/system'

export default {
  data() {
    return {
      title: 'Hello',
      res: '',
      notlist: ['寒雨连江夜入吴', '平明送客楚山孤', '洛阳亲友如相问', '一片冰心在玉壶'],
    }
  },
  computed: {
    primaryColorLight() {
      return uni.$u.colorGradient(this.primaryColor, '#ffffff', 100)[80]
    },
  },
  onLoad() {},
  methods: {
    async login() {
      this.$store
        .dispatch('$Login', {
          loginForm: { userCode: '10419421', password: 'qms.123456' },
        })
        .then(() => {
          this.$store.dispatch('$GetInfo')
        })
      // GetLangResource({})
      // let res = await SubmitLogin({"userCode": "10419421","password": "qms.123456"})
      // console.log("res");
      // this.$msg.confirm('43',JSON.stringify(res))
      // console.log(res);
      // this.res = res
    },
    changeLan() {
      const storge = uni.getStorageSync('language')
      this.$loadLanguageAsync(storge == 'zh-CN' ? 'en-US' : 'zh-CN')
    },
    navNewPage() {
      this.$Router.push('/pages/home/home')
    },
    query() {
      // this.primaryTheme = this.themeName == 'theme-night' ? 'theme-default' : 'theme-night'
      this.$store.dispatch('$SetTheme', this.themeName == 'theme-night' ? 'theme-default' : 'theme-night')
      this.$store.dispatch('$SetThemeColor', this.primaryColor == '#FFCF33' ? { primaryColor: '#F03D3D' } : { primaryColor: '#FFCF33' })
      console.log('this.primaryColor')
      console.log(this.primaryColor)
      // this.$store.dispatch('$GetDictByKey', ["quality_iqc_schedule",'qms_label_print'])
    },
    envi() {
      console.log('this.themeName')
      console.log(this.$store.getters)
      console.log(this.themeName, this.primaryColor, this.primaryColorLight, this.errorColor)
      console.log(JSON.stringify(process.env))
    },
    showMessage() {
      this.mom.showAlert(
        {
          message: '登录成功',
          content: '登录成功',
          type: 'success',
        },
        res => {
          console.log(res)
        },
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
}
</style>
