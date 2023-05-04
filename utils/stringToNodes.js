/**
 * 将匹配的值在完整的值中匹配并转成节点形式
 * @param {string} value 匹配的值
 * @param {string} keyword 完整的值
 */
export default function(value, keyword) {
  const nodes = []
  if (keyword.startsWith(value)) {
    const residueValue = keyword.slice(value.length)
    const matchNode = {
      name: "span",
      attrs: {
        style: "color: #26ce8a"
      },
      children: [{
        type: "text",
        text: value
      }]
    }
    nodes.push(matchNode)
    const residueNode = {
      name: "span",
      attrs: {
        style: "color: #000"
      },
      children: [{
        type: "text",
        text: residueValue
      }]
    }
    nodes.push(residueNode)
  } else {
    const node = {
      name: "span",
      attrs: {
        style: "color: #000"
      },
      children: [{
        type: "text",
        text: keyword
      }]
    }
    nodes.push(node)
  }
  return nodes
}