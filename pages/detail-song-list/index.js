// pages/detail-song-list/index.js
import { rankingStore, playerStore } from "../../store/index"
import { getSongMenuDetailData } from "../../service/musicApi"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    rankingName: "",
    songsInfo: {}
  },

  // 事件函数
  /**
   * 获取共享的榜单数据
   * @param {Object} res 回调函数参数-音乐列表信息
   */
  getRankingDataHandle(res) {
    this.setData({ songsInfo: res })
  },

  /**
   * 设置当前音乐所属列表和索引
   * @param {object} event 事件参数
   */
  handleSongItemClick(event) {
    const playListIndex = event.currentTarget.dataset.songindex
    playerStore.setState("playListSong", this.data.songsInfo.tracks)
    playerStore.setState("playListIndex", playListIndex)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ type: options.type })
    if (this.data.type === "rank") {
      const rankingName = options.rankingName
      this.setData({ rankingName })
      rankingStore.onState(rankingName, this.getRankingDataHandle)
    } else if (this.data.type === "menu") {
      const songMenuId = options.songMenuId
      getSongMenuDetailData(songMenuId).then(res => {
        this.setData({ songsInfo: res.playlist })
      })
    }
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
    if (this.data.rankingName) {
      rankingStore.offState(this.data.rankingName, this.getRankingDataHandle)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})