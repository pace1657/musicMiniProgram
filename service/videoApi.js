import requestUtils from "./index"

/**
 * 获取视频首页数据
 * @param { number } offset 偏移量
 * @param { number } limit 请求数
 */
export function getTopMVs(offset, limit = 10) {
  return requestUtils.get("/top/mv", {
    offset,
    limit
  })
}

/**
 * 根据ID获取视频数据
 * @param { number } id 视频ID
 */
export function getMVURL(id) {
  return requestUtils.get("/mv/url", {
    id
  })
}

/**
 * 根据ID获取视频详情信息
 * @param { number } mvid 视频ID
 */
export function getMVDetail(mvid) {
  return requestUtils.get("/mv/detail", {
    mvid
  })
}

/**
 * 根据ID获取相关视频数据
 * @param { number } id 视频ID
 */
export function getRelatedVideo(id) {
  return requestUtils.get("/related/allvideo", {
    id
  })
}