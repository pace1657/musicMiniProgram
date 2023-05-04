// pages/music-player/index.js
// import { getSongDetailData, getSongLyricData } from "../../service/playerApi"
// import parseLyric from "../../utils/parseLyric"
import { audioContext, playerStore } from "../../store/index"

const playModeMap = {
  0: "order",
  1: "repeat",
  2: "random"
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",

    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0,
    isPlaying: false,
    playingName: "pause",
    playModeIndex: 0,
    playModeName: "order",

    contentHeight: 0,
    currentPage: 0
  },

  // 网络请求
  /**
   * 获取页面数据请求
   */
  // getPageData() {
  //   const id = this.data.id
  //   getSongDetailData(id).then(res => {
  //     this.setData({ 
  //       currentSong: res.songs[0],
  //       durationTime: res.songs[0].dt
  //      })
  //   })
  //   getSongLyricData(id).then(res => {
  //     const lyricString = res.lrc.lyric
  //     const lyricInfos = parseLyric(lyricString)
  //     this.setData({ lyricInfos })
  //   })
  // },

  // 事件处理
  /**
   * 页面切换事件
   * @param {object} event 事件参数
   */
  handleSwiperChange(event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },
  /**
   * 进度条正在改变事件(点击未松开)
   * @param {object} event 事件参数
   */
  handleSliderChanging(event) {
    const currentTime = event.detail.value
    this.setData({ isSliderChanging: true, currentTime })
  },
  /**
   * 进度条改变事件
   * @param {object} event 事件参数
   */
  handleSliderChange(event) {
    const currentTime = event.detail.value
    audioContext.pause()
    audioContext.seek(currentTime / 1000)
    playerStore.dispatch("changeMusicPlayStatusAction")
    this.setData({ 
      currentTime, 
      sliderValue: currentTime, 
      isSliderChanging: false
    })
  },
  /**
   * 回退页面事件
   */
  handleBackClick() {
    wx.navigateBack()
  },
  /**
   * 播放模式点击事件
   */
  handleModeIconClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0
    // 设置playModeIndex到playerStore
    playerStore.setState("playModeIndex", playModeIndex)
  },
  /**
   * 暂停/播放点击事件
   */
  handlePlayIconClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  /**
   * 上一首/下一首点击事件
   */
  handlePrevIconClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextIconClick() {
    playerStore.dispatch("changeNewMusicAction")
  },

  // audioContext事件监听
  // setupAudioContextListener() {
  //   // 监听音频进入可以播放状态
  //   audioContext.onCanplay(() => {
  //     audioContext.play()
  //   })
  //   // 监听时间更新
  //   audioContext.onTimeUpdate(() => {
  //     // 获取当前时间
  //     const currentTime = audioContext.currentTime * 1000
  //     // 根据当前时间修改currentTime
  //     if (!this.data.isSliderChanging) {
  //       if (this.data.isFirstTimeUpdate) {
  //         this.setData({ isFirstTimeUpdate: false })
  //         return
  //       }
  //       this.setData({ currentTime, sliderValue: currentTime })
  //     }
  //     // 根据当前时间查找播放的歌词
  //     let i = 0
  //     for (i; i < this.data.lyricInfos.length; i++) {
  //       const lyricInfo = this.data.lyricInfos[i]
  //       if (currentTime < lyricInfo.time) break
  //     }
  //     // 设置当前歌词的索引和内容
  //     const currentLyricIndex = i - 1
  //     if (currentLyricIndex !== this.data.currentLyricIndex) {
  //       const currentLyricText = this.data.lyricInfos[currentLyricIndex].text
  //       const lyricScrollTop = currentLyricIndex * 35
  //       this.setData({ currentLyricIndex, currentLyricText, lyricScrollTop })
  //     }
  //   })
  //   // 监听音频播放结束
  //   // audioContext.onEnded(() => {
  //   //   if (!this.data.isSliderChanging) {
  //   //     this.setData({ currentTime: this.data.durationTime })
  //   //   }
  //   // })
  // },

  // 播放音乐数据监听
  setupPlayerStoreListener() {
    // currentSong/durationTime/lyricInfos变化监听
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })
    // currentTime/currentLyricIndex/currentLyricText变化监听
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText,
    }) => {
      if (currentTime && !this.data.isSliderChanging) {
        this.setData({ currentTime, sliderValue: currentTime })
      }
      if (currentLyricIndex) this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      if (currentLyricText) this.setData({ currentLyricText })
    })
    // isPlaying/playModeIndex变化监听
    playerStore.onStates(["isPlaying", "playModeIndex"], ({
      isPlaying,
      playModeIndex
    }) => {
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? "pause" : "resume"
        })
      }
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeMap[playModeIndex]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({ id })
    // 监听音乐播放数据
    this.setupPlayerStoreListener()
    // 获取页面数据
    // this.getPageData()
    // 计算内容区域高度
    const globalData = getApp().globalData
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.customNavBarHeight
    const screenHeight = globalData.screenHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })

    // 使用audioContext播放歌曲
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    // 监听audioContext事件
    // this.setupAudioContextListener()
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