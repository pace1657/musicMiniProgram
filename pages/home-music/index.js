// pages/home-music/index.js
import { rankingStore, playerStore } from "../../store/index"

import { getBannerData, getSongMenuData } from "../../service/musicApi"
import getNodeInfo from "../../utils/getNodeInfo"
import throttle from "../../utils/throttle"

// 生成节流函数
const throttleGetNodeInfo = throttle(getNodeInfo, 1000, { leading: true, trailing: true })

// 榜单 ID-名称 映射
const rankingMap = {
  // 新歌
  3779629: "newRanking",
  // 原创
  2884035: "originRanking",
  // 飙升
  19723756: "surgeRanking",
  // 热歌
  3778678: "hotRanking"
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerData: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: {3779629: {}, 2884035: {}, 19723756: {}},

    currentSong: {},
    isPlaying: false,
    animationState: "paused"
  },

  // 事件函数
  /**
   * 监听搜索框点击
   */
  handleSearchBarClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  /**
   * 监听图片组件加载完成获取节点信息
   */
  handleImageLoaded() {
    throttleGetNodeInfo(".swiper-image").then(res => {
      const nodeRectInfo = res[0]
      this.setData({ swiperHeight: nodeRectInfo.height })
    })
  },
  /**
   * 设置不同榜单的共享数据
   * @param {number} id 榜单id
   */
  getRankingHandle(id) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = {...this.data.rankings, [id]: rankingObj}
      this.setData({ rankings: newRankings })
    }
  },
  /**
   * 跳转到榜单歌曲列表页
   * @param {object} event 事件参数
   */
  handleToSongListClick(event) {
    const rankingid = event.currentTarget.dataset.rankingid
    const rankingName = rankingMap[rankingid]
    wx.navigateTo({
      url: `/pages/detail-song-list/index?rankingName=${rankingName}&type=rank`
    })
  },
  /**
   * 设置当前音乐所属列表和索引
   * @param {object} event 事件参数
   */
  handleSongItemClick(event) {
    const playListIndex = event.currentTarget.dataset.songindex
    playerStore.setState("playListSong", this.data.recommendSongs)
    playerStore.setState("playListIndex", playListIndex)
  },
  /**
   * 监听playerStore数据变化
   */
  setupPlayerStoreListener() {
    // currentSong/isPlaying监听
    playerStore.onStates(["currentSong", "isPlaying"], ({
      currentSong,
      isPlaying
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying != undefined) {
        this.setData({
          isPlaying,
          animationState: isPlaying ? "running" : "paused"
        })
      }
    })
  },
  /**
   * 监听播放/暂停点击
   */
  handlePlayIconClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  /**
   * 监听底部播放栏点击
   */
  handlePlayBarClick() {
    wx.navigateTo({
      url: `/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  },

  // 请求数据函数
  getMusicPageData() {
    // 获取轮播图数据
    getBannerData().then(res => {
      this.setData({ bannerData: res.banners })
    })
    // 获取歌单数据
    getSongMenuData().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenuData("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面数据
    this.getMusicPageData()
    // 请求共享数据
    rankingStore.dispatch("getRankingDataAction")
    // 获取共享数据
    rankingStore.onState("hotRanking", res => {
      if (!res?.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    // 获取榜单数据
    rankingStore.onState("newRanking", this.getRankingHandle(3779629))
    rankingStore.onState("originRanking", this.getRankingHandle(2884035))
    rankingStore.onState("surgeRanking", this.getRankingHandle(19723756))

    // 监听数据
    this.setupPlayerStoreListener()
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