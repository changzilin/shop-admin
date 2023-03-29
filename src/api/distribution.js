import axios from "./request"
import { formatParams } from "@/utils/common.js"


// 分销员管理 --------------------------
// 分销数据统计
export const getAgentStatistics = () => axios.get("/admin/agent/statistics")
// 获取分销推广员列表
export const getAgentList = (page, data) => {
  return axios.get(`/admin/agent/${page}` + formatParams(data))
}
// 获取推广订单列表
export const getAgentOrderList = (page, data) => {
  return axios.get(`/admin/user_bill/${page}` + formatParams(data))
}


// 分销设置 --------------------------
// 获取分销配置
export const getConfig = () => axios.get("/admin/distribution_setting/get")
// 修改分销配置
export const setConfig = (data) => axios.post("/admin/distribution_setting/set", data)
