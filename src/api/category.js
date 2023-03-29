import axios from "./request"


// 商品分类管理 --------------------------
// 获取列表
export const getCategoryList = () => axios.get("/admin/category")
// 修改商品分类
export const updateCategory = (id, data) => axios.post(`/admin/category/${id}`, data)
// 增加商品分类
export const addCategory = (data) => axios.post("/admin/category", data)
// 修改商品分类状态
export const updateCategoryStatus = (id, status) => axios.post(`/admin/category/${id}/update_status`, { status })
// 删除商品分类
export const deleteCategory = (id) => axios.post(`/admin/category/${id}/delete`)

// 获取分类关联产品列表
export const getCategoryGoods = (id) => axios.get(`/admin/app_category_item/list?category_id=${id}`)
// 删除关联产品
export const deleteCategoryGoods = (id) => axios.post(`/admin/app_category_item/${id}/delete`)
// 关联产品
export const connectCategoryGoods = (data) => axios.post("/admin/app_category_item", data)
