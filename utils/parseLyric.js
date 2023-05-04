/**
 * 将歌词字符串转为对象集合
 * @param {string} lyricString 歌词字符串
 */

const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export default function parseLyric(lyricString) {
  const lyricInfos = []
  const lyricStrings = lyricString.split("\n")
  for (const lineLyric of lyricStrings) {
    const timePatternResult = timePattern.exec(lineLyric)
    if (!timePatternResult) continue
    // 获取歌词时间
    const minute = timePatternResult[1] * 60 * 1000
    const second = timePatternResult[2] * 1000
    let millisecond = timePatternResult[3]
    millisecond = millisecond.length === 2 ? millisecond * 10 : millisecond * 1
    const time = minute + second + millisecond
    // 获取歌词文本
    const text = lineLyric.replace(timePattern, "")
    lyricInfos.push({time, text})
  }
  return lyricInfos
}