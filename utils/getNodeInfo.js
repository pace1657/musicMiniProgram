/**
 * 通过选择器获取节点信息
 * @param { string } selector 选择器
 */
export default function(selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec(resolve)
    // query.exec(res => {
    //   resolve(res)
    // })
  })
}