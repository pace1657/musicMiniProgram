// pages/home-video/index.js
import { getTopMVs } from "../../service/videoApi"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  // 封装网络请求的方法
  async getTopMVsData(offset) {
    // 判断是否能发送请求
    if (!this.data.hasMore && offset !== 0) return
    // 显示请求动画
    wx.showNavigationBarLoading()
    const res = await getTopMVs(offset)
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({ topMVs: newData, hasMore: res.hasMore })
    // 关闭请求动画
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 封装事件处理方法
  handleVideoItemClick(event) {
    const itemId = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?itemId=${itemId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopMVsData(0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getTopMVsData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getTopMVsData(this.data.topMVs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})