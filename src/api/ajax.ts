
import { message } from 'antd'
import axios from 'axios'
import qs from 'qs'

const baseURL = '/'
const instance = axios.create({
  baseURL: baseURL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
    'data-type': 'json',
  }
})
const instanceNoHead = axios.create({
  baseURL: baseURL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'data-type': 'json',
  }
})
const custom = {
  failHintType: 'msg', // 失败提示类型
  successHintType: '', // 成功提示类型
  successMsg: '', // 成功提示消息
  isWait: true, // 是否显示加载框
  confirmMsg: '', // 是否需要确定的消息，不传则不弹框
  onFail: () => {}, // 错误回调
  finallyBack: () => {}, // 最终回调
}


/**
 * 响应 json 通用成功处理函数
 * @param {Object} customOptions 自定义配置
 * @param {Object} response 响应
 * @param {Function} resolve 回调
 * @param {String} url 请求地址
 */
const jsonSuccessBack = (customOptions:any, response:any, resolve:any, url:string) => {
  const result = response.data
  if (result.status.code == 0) {
    const { successMsg, successHintType } = customOptions
    if (successMsg) {
      message.success(successMsg)
    } else if (successHintType === 'msg') {
      message.success(result.status.message)
    }
    resolve(result.data)
  } else {
    if (customOptions.failHintType) {
      message.warning(result.status.message)
    }
    if (typeof customOptions.onFail === 'function') {
      customOptions.onFail(result)
    }
  }
}

/**
 * 错误回调
 * @param {Object} error 错误回调返回
 * @param {Object} customOptions 自定义配置
 * @param {String} url 请求地址
 */
const errorBack = (error:any, customOptions:any, url:string) => {
  if (error && error.response) message.error('网络异常,请稍后重试!')
}

const beforeBack = (customOptions:any)=> {
  return new Promise((resolve) => {
    resolve(customOptions)
  })
}

/**
 * 最终处理
 * @param {Object} customOptions 自定义配置
 */
const finallyBack = (customOptions:any) => {
  if (typeof customOptions.finallyBack === 'function') {
    customOptions.finallyBack()
  }
}

export const get = (url:string, data?:any, customOptions:any = {}) => {
  customOptions = Object.assign({}, custom, customOptions)

  return new Promise(resolve => {
    beforeBack(customOptions).then(() => {
      instance.get(url, {
        params: data,
        // 处理 get 参数为 array 的情况
        paramsSerializer: function(params:any) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }).then((response:any) => {
        jsonSuccessBack(customOptions, response, resolve, url)
        finallyBack(customOptions)
      }).catch((error:any) => {
        errorBack(error, customOptions, url)
        finallyBack(customOptions)
      })
    })
  })
}
export const post = (url:string, data?:any, customOptions:any = {}) => {
  customOptions = Object.assign({}, custom, customOptions)
  return new Promise(resolve => {
    beforeBack(customOptions).then(() => {
      instance.post(url, JSON.stringify(data))
        .then((response:any) => {
          jsonSuccessBack(customOptions, response, resolve, url)
          finallyBack(customOptions)
        })
        .catch((error:any) => {
          errorBack(error, customOptions, url)
          finallyBack(customOptions)
        })
    })
  })
}

export const submit = (url:string, data?:any, customOptions:any = {}) => {
  customOptions = Object.assign({}, custom, customOptions)
  return new Promise(resolve => {
    beforeBack(customOptions).then(() => {
      instance.post(url, qs.stringify(data, { indices: false }), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      })
        .then((response:any) => {
          jsonSuccessBack(customOptions, response, resolve, url)
          finallyBack(customOptions)
        })
        .catch((error:any) => {
          errorBack(error, customOptions, url)
          finallyBack(customOptions)
        })
    })
  })
}

const ajax = {
  post,
  get,
  submit,
}

export default ajax
