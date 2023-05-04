import { HYEventStore } from "hy-event-store"
import { getRankingData } from "../service/musicApi"

const rankingStore = new HYEventStore({
  state: {
    hotRanking: {},
    newRanking: {},
    originRanking: {},
    surgeRanking: {}
  },
  actions: {
    // 获取歌曲榜单数据
    getRankingDataAction(context) {
      // 热歌榜
      getRankingData(3778678).then(res => {
        context.hotRanking = res.playlist
      })
      // 新歌榜
      getRankingData(3779629).then(res => {
        context.newRanking = res.playlist
      })
      // 原创榜
      getRankingData(2884035).then(res => {
        context.originRanking = res.playlist
      })
      // 飙升榜
      getRankingData(19723756).then(res => {
        context.surgeRanking = res.playlist
      })
    }
  }
})

export {
  rankingStore
}
