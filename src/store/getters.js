const getters = {
  RealName: state => state.user.userInfo.RealName,
  UserCode: state => state.user.userInfo.UserCode,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.userInfo,
  orgCode: state => state.user.orgCode,
  orgName: state => state.user.orgName,
  dictMap: state => state.system.dictMap,
  themeName: state => state.system.theme.themeName,
  primaryColor: state => state.system.theme.primaryColor,
  infoColor: state => state.system.theme.infoColor,
  errorColor: state => state.system.theme.errorColor,
  successColor: state => state.system.theme.successColor,
  warnColor: state => state.system.theme.warnColor,
}
export default getters
