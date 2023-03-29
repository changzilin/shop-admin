import axios from "./request"

// 获取首页信息
export const getStatistics1 = () => axios.get("/admin/statistics1")

// 获取首页信息
export const getStatistics2 = () => axios.get("/admin/statistics2")

// 获取首页图表信息
export const getStatistics3 = (type) => axios.get(`/admin/statistics3?type=${type}`)
