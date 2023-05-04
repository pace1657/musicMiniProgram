import requestUtils from "./index"

/**
 * 获取轮播图数据
 */
export function getBannerData() {
  return requestUtils.get("/banner", {
    // 资源类型: 0-PC 1-Android 2-iPhone 3-iPad
    type: 2
  })
}
/**
 * 获取歌曲排行榜信息
 * @param {number} id 榜单id 
 */
export function getRankingData(id) {
  return requestUtils.get("/playlist/detail", {
    id
  })
}
/**
 * 获取歌单信息
 * @param {string} cat 类别
 * @param {number} limit 数量
 * @param {number} offset 偏移量
 */
export function getSongMenuData(cat="全部", limit=6, offset=0) {
  return requestUtils.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}
/**
 * 获取歌单详情(歌曲列表等)
 * @param {number} id 歌单id
 */
export function getSongMenuDetailData(id) {
  return requestUtils.get("/playlist/detail", {
    id
  })
}
