const BASE_URL = "http://codercba.com:9002"

class RequestUtils {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        success: (res) => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(url, params) {
    return this.request(url, "GET", params)
  }
  post(url, data) {
    return this.request(url, "POST", data)
  }
}

const requestUtils = new RequestUtils()

export default requestUtils
