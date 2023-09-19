<template>
  <mom-layout ref="momLayout">
    <template>
      <view class="login-main">
        <view class="login-header">
          <view class="login-welcome">
            <text>{{ $tl('login_welcome1', '欢迎登录') }}</text>
            <br />
            <text>{{ $tl('login_welcome2', 'MOM管理系统') }}</text>
          </view>
        </view>
        <view class="login-form">
          <h2 class="padding-bottom-sm padding-lr-sm">
            {{ $tl('login', '登录') }}
          </h2>
          <u--form :model="loginForm" :rules="rules" ref="loginForm" labelPosition="top">
            <u-form-item prop="UserCode">
              <u--input
                :placeholder="$tl('base_login_placeholder_name', '请输入用户工号')"
                v-model="loginForm.UserCode"
                :customStyle="inputStyle"
                border="none"
                @confirm="loginSumbit"
                clearable
              ></u--input>
            </u-form-item>
            <u-form-item prop="Password">
              <u--input
                v-model="loginForm.Password"
                :placeholder="$tl('base_login_placeholder_pwd', '请输入密码')"
                :customStyle="inputStyle"
                border="none"
                type="password"
                @confirm="loginSumbit"
                clearable
              ></u--input>
            </u-form-item>
            <u-form-item>
              <u-button @click="loginSumbit" size="large" formType="submit" :color="buttonColor" :customStyle="buttonStyle">{{ $tl('login_now', '立即登录') }}</u-button>
            </u-form-item>
          </u--form>
        </view>
      </view>
    </template>
  </mom-layout>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: 'https://momfile.lingyiitech.com:8899/images/login-bg.png',
      inputStyle: {
        borderRadius: '24rpx',
        width: '654rpx',
        backgroundColor: '#F4F4F4',
        height: '128rpx',
        padding: '40rpx 48rpx',
      },
      loginForm: {
        UserCode: '',
        Password: '',
      },
      buttonColor: '',
      buttonStyle: {
        borderRadius: '24rpx',
        height: '64px',
        fontSize: '16px',
      },
      rules: {
        UserCode: {
          type: 'string',
          required: true,
          message: '请输入用户工号/AD账号',
          trigger: ['blur', 'change'],
        },
        Password: {
          type: 'string',
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'change'],
        },
      },
    }
  },
  created() {
    // 获取主题色的淡化色值
    const primaryColorLight = uni.$u.colorGradient(this.primaryColor, '#ffffff', 100)[30]
    this.buttonColor = `linear-gradient(0.25turn, ${primaryColorLight},${this.primaryColor})`
  },
  methods: {
    loginSumbit() {
      this.$refs.loginForm
        .validate()
        .then(async () => {
          const res = await this.$store.dispatch('$Login', {
            loginForm: this.loginForm,
          })
          if (res.Success) {
            const rsp = await this.$store.dispatch('$GetInfo')
            if (rsp.Success) {
              this.$Router.replaceAll('/pages/index/index')
            } else {
              this.mom.showAlert({
                message: res.Msg,
                type: 'error',
              })
            }
          } else {
            this.mom.showNotify({
              content: res.Msg,
              type: 'error',
            })
          }
        })
        .catch(() => {
          this.mom.showNotify({
            content: '请完善表单',
            type: 'error',
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-main {
  //   position: relative;
  .login-header {
    background-image: url('https://momfile.lingyiitech.com:8899/images/login-bg.png');
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 340rpx;
    .login-welcome {
      padding-top: 80rpx;
      //   text-align: right;
    }
    text {
      color: #fff;
      font-weight: bold;
      font-size: 40rpx;
      padding: 0 40rpx;
      line-height: 80rpx;
    }
    // position: relative;
    // &::after {
    //     content: 'MOM';
    //     position: absolute;
    //     top:10%;
    //     left: 10%;
    //     color: #fff;
    // }
    // top: 0;
    // left: 0;
  }
  .login-form {
    margin-top: -60rpx;
    padding: 40rpx 40rpx;
    border-radius: 50rpx 50rpx 0 0;
    background: #fff;
    z-index: 9;
    height: calc(100vh - 368rpx);
  }
}
</style>
