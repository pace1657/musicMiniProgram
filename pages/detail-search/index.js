// pages/detail-search/index.js
import { getHotSearchData, getSuggestSearchData, getSearchSongData } from "../../service/searchApi"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/stringToNodes"
import { playerStore } from "../../store/index"

// 生成防抖函数
const debounceGetSuggestSearchData = debounce(getSuggestSearchData, 300)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    searchValue: "",
    suggestSearchs: [],
    suggestSearchNodes: [],
    searchSongs: []
  },
  
  // 网络请求
  /**
   * 获取页面数据
   */
  getSearchPageData() {
    getHotSearchData().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  // 事件函数
  /**
   * 监听搜索框值改变
   * @param {string} event 搜索框改变事件参数
   */
  handleChangeSearchValue(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      this.setData({
        suggestSearchs: [],
        suggestSearchNodes: [],
        searchSongs: []
      })
      debounceGetSuggestSearchData.cancel()
      return
    }
    debounceGetSuggestSearchData(searchValue).then(res => {
      const suggestSearchs = res.result.allMatch
      if (!suggestSearchs) return
      this.setData({ suggestSearchs })
      // 将文字转为node节点
      const suggestKeywords = suggestSearchs.map(item => item.keyword)
      const suggestSearchNodes = []
      for (let keyword of suggestKeywords) {
        const nodes = stringToNodes(this.data.searchValue, keyword)
        suggestSearchNodes.push(nodes)
      }
      this.setData({ suggestSearchNodes })
    })
  },
  /**
   * 点击关键字发送请求搜索歌曲
   * @param {object} event 事件参数
   */
  handleKeywordSearchClick(event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })
    this.handleSearchValueAction()
  },
  /**
   * 发送请求搜索歌曲
   */
  handleSearchValueAction() {
    const keyword = this.data.searchValue
    this.setData({ suggestSearchs: [] })
    this.setData({ suggestSearchNodes: [] })
    getSearchSongData(keyword).then(res => {
      this.setData({ searchSongs: res.result.songs })
    })
  },
  /**
   * 设置当前音乐所属列表和索引
   * @param {object} event 事件参数
   */
  handleSongItemClick(event) {
    const playListIndex = event.currentTarget.dataset.songindex
    playerStore.setState("playListSong", this.data.searchSongs)
    playerStore.setState("playListIndex", playListIndex)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面数据
    this.getSearchPageData()
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