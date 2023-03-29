import axios from "./request"

// 获取公告数据
export const getNoticeList = (page) => axios.get(`/admin/notice/${page}`)

// 新增公告
export const addNotice = (data) => axios.post("/admin/notice", data)

// 修改公告
export const updateNotice = (id, data) => axios.post(`/admin/notice/${id}`, data)

// 删除公告
export const deleteNotice = (id) => axios.post(`/admin/notice/${id}/delete`)