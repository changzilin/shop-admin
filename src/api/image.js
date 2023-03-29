import axios from "./request"
import { formatParams } from "@/utils/common.js"

// 获取图库列表
export const getImageList = (page) => axios.get(`/admin/image_class/${page}`)

// 新增图库分类
export const addImageClass = (data) => axios.post("/admin/image_class", data)

// 修改图库分类
export const updateImageClass = (id, data) => axios.post(`/admin/image_class/${id}`, data)

// 删除图库分类
export const deleteImageClass = (id) => axios.post(`/admin/image_class/${id}/delete`)

// 获取指定分类下的图片列表
export const getImageClassList = (id, page, data) => {
  return axios.get(`/admin/image_class/${id}/image/${page}` + formatParams(data))
}

// 修改图片名称
export const updateImage = (id, name) => axios.post(`/admin/image/${id}`, { name })

// 删除图片
export const deleteImage = (ids) => axios.post("/admin/image/delete_all", { ids })

// 上传图片地址
export const uploadImageUrl = `${import.meta.env.VITE_APP_BASE_API}/admin/image/upload`

