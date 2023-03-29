import axios from "./request"
import { formatParams } from "@/utils/common.js"


// 首页 --------------------------
// 登录
export const login = (username, password) => axios.post("/admin/login", { username, password })
// 获取用户信息
export const getInfo = () => axios.post("/admin/getinfo")
// 退出
export const logout = () => axios.post("/admin/logout")
// 修改密码
export const updatepassword = data => axios.post("/admin/updatepassword", data)


// 管理员管理 --------------------------
// 获取列表
export const getManagerList = (page, data) => {
  return axios.get(`/admin/manager/${page}` + formatParams(data))
}
// 修改状态
export const updateManagerStatus = (id, status) => axios.post(`/admin/manager/${id}/update_status`, { status })
// 添加
export const addManager = (data) => axios.post("/admin/manager", data)
// 修改
export const updateManager = (id, data) => axios.post(`/admin/manager/${id}`, data)
// 删除
export const deleteManager = (id) => axios.post(`/admin/manager/${id}/delete`)


// 权限管理 --------------------------
// 获取列表
export const getRuleList = (page) => axios.get(`/admin/rule/${page}`)
// 修改权限
export const updateRule = (id, data) => axios.post(`/admin/rule/${id}`, data)
// 添加
export const addRule = (data) => axios.post("/admin/rule", data)
// 修改状态
export const updateRuleStatus = (id, status) => axios.post(`/admin/rule/${id}/update_status`, { status })
// 删除
export const deleteRule = (id) => axios.post(`/admin/rule/${id}/delete`)


// 角色管理 --------------------------
// 获取角色列表
export const getRoleList = (page) => axios.get(`/admin/role/${page}`)
// 添加
export const addRole = (data) => axios.post("/admin/role", data)
// 修改权限
export const updateRole = (id, data) => axios.post(`/admin/role/${id}`, data)
// 删除
export const deleteRole = (id) => axios.post(`/admin/role/${id}/delete`)
// 修改状态
export const updateRoleStatus = (id, status) => axios.post(`/admin/role/${id}/update_status`, { status })
// 配置角色权限
export const setRoleRules = (id, rule_ids) => axios.post("/admin/role/set_rules", { id, rule_ids })
