import requestUtils from "./index"

/**
 * 获取热门搜索关键字
 */
export function getHotSearchData() {
  return requestUtils.get("/search/hot")
}

/**
 * 查询推荐搜索歌曲
 * @param {string} keywords 搜索内容
 */
export function getSuggestSearchData(keywords) {
  return requestUtils.get("/search/suggest", {
    type: "mobile",
    keywords
  })
}

/**
 * 查询歌曲
 * @param {string} keywords 歌曲名
 */
export function getSearchSongData(keywords) {
  return requestUtils.get("/cloudsearch", {
    keywords
  })
}