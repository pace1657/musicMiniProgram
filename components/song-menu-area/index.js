// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    songMenu: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToSongListClick(event) {
      const songMenuId = event.currentTarget.dataset.songmenuid
      wx.navigateTo({
        url: `/pages/detail-song-list/index?songMenuId=${songMenuId}&type=menu`
      })
    }
  }
})
