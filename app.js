// app.js
App({
  onLaunch() {
    const sysInfo = wx.getSystemInfoSync()
    this.globalData.platform = sysInfo.platform
    this.globalData.screenWidth = sysInfo.screenWidth
    this.globalData.screenHeight = sysInfo.screenHeight
    this.globalData.statusBarHeight = sysInfo.statusBarHeight
  },
  globalData: {
    platform: "",
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    customNavBarHeight: 44
  }
})
