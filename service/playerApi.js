import requestUtils from "./index"

/**
 * 根据id查询歌曲详情
 * @param {number} ids 歌曲id
 */
export function getSongDetailData(ids) {
  return requestUtils.get("/song/detail", {
    ids
  })
}
/**
 * 根据id查询歌曲歌词
 * @param {number} id 歌曲id
 */
export function getSongLyricData(id) {
  return requestUtils.get("/lyric", {
    id
  })
}