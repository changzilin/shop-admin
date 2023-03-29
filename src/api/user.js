import axios from "./request"
import { formatParams } from "@/utils/common.js"


// 用户管理 --------------------------
// 获取用户列表
export const getUserlList = (page, data) => {
  return axios.get(`/admin/user/${page}` + formatParams(data))
}
// 增加用户
export const addUser = (data) => axios.post("/admin/user", data)
// 修改用户
export const updateUser = (id, data) => axios.post(`/admin/user/${id}`, data)
// 删除会员
export const deleteUser = (id) => axios.post(`/admin/user/${id}/delete`)
// 修改用户状态
export const updateUserStatus = (id, status) => axios.post(`/admin/user/${id}/update_status`, { status })


// 会员等级 --------------------------
// 获取会员等级列表
export const getUserLevelList = (page) => axios.get(`/admin/user_level/${page}`)
// 增加会员等级
export const addUserLevel = (data) => axios.post("/admin/user_level", data)
// 修改会员等级
export const updateUserLevel = (id, data) => axios.post(`/admin/user_level/${id}`, data)
// 删除会员等级
export const deleteUserLevel = (id) => axios.post(`/admin/user_level/${id}/delete`)
// 修改会员等级状态
export const updateUserLevelStatus = (id, status) => axios.post(`/admin/user_level/${id}/update_status`, { status })