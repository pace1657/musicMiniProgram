import { HYEventStore } from "hy-event-store"
import { getSongDetailData, getSongLyricData } from "../service/playerApi"
import parseLyric from "../utils/parseLyric"

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    isFirstPlay: true,
    // 音乐信息
    currentSong: {},
    durationTime: 0,
    currentTime: 0,
    // 歌词信息
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",
    // 操作栏信息
    isPlaying: false,
    isStoping: false,
    playModeIndex: 0,
    // 播放列表
    playListSong: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(context, { id, isRefresh = false }) {
      if (context.id === id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      context.id = id

      // 重置信息
      this.dispatch("resetOldSongInfo")

      // 修改播放状态
      context.isPlaying = true

      // 根据歌曲id获取歌曲和歌词信息
      getSongDetailData(id).then(res => {
        context.currentSong = res.songs[0],
        context.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      getSongLyricData(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        context.lyricInfos = lyricInfos
      })

      // 播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      // audioContext.autoplay = true
      audioContext.play()

      console.log(id, context.currentSong.name);

      // 监听audioContext的部分事件
      if (context.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        context.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction(context) {
      // 监听音频进入可以播放状态
      // audioContext.onCanplay(() => {
      //   console.log("onCanplay");
      //   audioContext.play()
      // })

      // 监听时间更新
      audioContext.onTimeUpdate(() => {
        // 获取当前时间
        const currentTime = audioContext.currentTime * 1000
        // 根据当前时间修改currentTime
        context.currentTime = currentTime
        // 根据当前时间查找播放的歌词
        let i = 0
        for (i; i < context.lyricInfos.length; i++) {
          const lyricInfo = context.lyricInfos[i]
          if (currentTime < lyricInfo.time) break
        }
        // 设置当前歌词的索引和内容
        const currentLyricIndex = i - 1
        if (currentLyricIndex !== context.currentLyricIndex) {
          const currentLyricText = context.lyricInfos[currentLyricIndex]?.text
          context.currentLyricIndex = currentLyricIndex
          context.currentLyricText = currentLyricText
        }
      })

      // 监听音乐播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })

      // 监听小程序外部控制音乐播放/暂停/停止
      audioContext.onPlay(() => {
        context.isPlaying = true
      })
      audioContext.onPause(() => {
        context.isPlaying = false
      })
      audioContext.onStop(() => {
        context.isPlaying = false
        context.isStoping = true
      })
    },

    changeMusicPlayStatusAction(context, isPlaying = true) {
      context.isPlaying = isPlaying
      if (context.isPlaying && context.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${context.id}.mp3`
        audioContext.title = context.currentSong.name
        // audioContext.seek(context.currentTime / 1000)
        context.isStoping = false
      }
      context.isPlaying ? audioContext.play() : audioContext.pause()
    },

    changeNewMusicAction(context, isNext = true) {
      // 获取当前索引
      let index = context.playListIndex
      // 根据播放模式设置下一首歌曲索引
      switch (context.playModeIndex) {
        case 0: //列表循环
          index = isNext ? index + 1 : index - 1
          if (index === context.playListSong.length) index = 0
          if (index === -1) index = context.playListSong.length - 1
          break
        case 1: //单曲循环
          break
        case 2: //随机播放
          index = Math.floor(Math.random() * context.playListSong.length)
          break
      }
      // 根据最新索引获取歌曲
      let currentSong = context.playListSong[index]
      if (!currentSong) {
        currentSong = context.currentSong
      } else {
        context.playListIndex = index
      }
      console.log(index, currentSong.name, currentSong.id);
      // 播放新歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    },

    resetOldSongInfo(context) {
      // 音乐信息
      context.currentSong = {},
      context.durationTime = 0,
      context.currentTime = 0,
      // 歌词信息
      context.lyricInfos = [],
      context.currentLyricIndex = 0,
      context.currentLyricText = ""
    }
  }
})

export {
  audioContext,
  playerStore
}