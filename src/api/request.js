import axios from "axios"
import store from "@/store/index.js"
import { notification } from "@/utils/common.js"
import { getToken } from "@/utils/token.js"

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function(config) {
  // 添加token
  const token = getToken()
  if (token) config.headers.token = token
  return config;
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
request.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  return response.request.responseType == "blob" ? response.data : response.data.data;
}, function(error) {
  let msg = error.response?.data?.msg || "请求失败！"
  if (msg == "非法token，请先登录！") {
    store.dispatch("logout").finally(() => location.reload())
  }
  notification(msg, "error", true)

  return Promise.reject(error)
});

export default request