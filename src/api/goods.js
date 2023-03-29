import axios from "./request"
import { formatParams } from "@/utils/common.js"


// 商品管理 --------------------------
// 获取列表
export const getGoodsList = (page, data) => {
  // ?tab=all&title=关键词&category_id=2&limit=10
  return axios.get(`/admin/goods/${page}` + formatParams(data))
}
// 修改
export const updateGoods = (id, data) => axios.post(`/admin/goods/${id}`, data)
// 添加
export const addGoods = (data) => axios.post("/admin/goods", data)
// 删除
export const deleteGoods = (ids) => axios.post("/admin/goods/delete_all", { ids })
// 审核商品
export const checkGoods = (id, data) => axios.post(`/admin/goods/${id}/check`, data)
// 彻底删除商品
export const destroyGoods = (ids) => axios.post("/admin/goods/destroy", { ids })
// 批量恢复商品
export const restoreGoods = (ids) => axios.post("/admin/goods/restore", { ids })
// 批量上架|下架商品
export const updateGoodsStatus = (ids, status) => axios.post("/admin/goods/changestatus", { ids, status })
// 查看商品资料
export const readGoods = (id) => axios.get(`/admin/goods/read/${id}`)
// 设置商品轮播图
export const setGoodsBanner = (id, data) => axios.post(`/admin/goods/banners/${id}`, data)
// 设置商品规格
export const updateGoodsSkus = (id, data) => axios.post(`/admin/goods/updateskus/${id}`, data)
// 添加商品规格
export const addGoodsSkusCard = (data) => axios.post("/admin/goods_skus_card", data)
// 修改商品规格选项
export const updateGoodsSkusCard = (id, data) => axios.post(`/admin/goods_skus_card/${id}`, data)
// 删除商品规格选项
export const deleteGoodsSkusCard = (id) => axios.post(`/admin/goods_skus_card/${id}/delete`)
// 排序商品规格选项
export const sortGoodsSkusCard = (data) => axios.post("/admin/goods_skus_card/sort", data)
// 添加商品规格选项的值
export const addGoodsSkusCardValue = (data) => axios.post("/admin/goods_skus_card_value", data)
// 修改商品规格选项的值
export const updateGoodsSkusCardValue = (id, data) => axios.post(`/admin/goods_skus_card_value/${id}`, data)
// 删除商品规格选项的值
export const deleteGoodsSkusCardValue = (id) => axios.post(`/admin/goods_skus_card_value/${id}/delete`)
// 选择设置商品规格选项和值
export const chooseAndSetGoodsSkusCard = (id, data) => axios.post(`/admin/goods_skus_card/${id}/set`, data)


// 规格管理 --------------------------
// 获取列表
export const getSkusList = (page) => axios.get(`/admin/skus/${page}`)
// 修改
export const updateSkus = (id, data) => axios.post(`/admin/skus/${id}`, data)
// 添加
export const addSkus = (data) => axios.post("/admin/skus", data)
// 修改状态
export const updateSkusStatus = (id, status) => axios.post(`/admin/skus/${id}/update_status`, { status })
// 删除
export const deleteSkus = (ids) => {
  ids = Array.isArray(ids) ? ids : [ids]
  return axios.post("/admin/skus/delete_all", { ids })
}


// 优惠券管理 --------------------------
// 获取列表
export const getCouponList = (page) => axios.get(`/admin/coupon/${page}`)
// 修改
export const updateCoupon = (id, data) => axios.post(`/admin/coupon/${id}`, data)
// 添加
export const addCoupon = (data) => axios.post("/admin/coupon", data)
// 删除
export const deleteCoupon = (id) => axios.post(`/admin/coupon/${id}/delete`)
// 失效优惠券
export const updateCouponStatus = (id, status = 0) => axios.post(`/admin/coupon/${id}/update_status`, { status })

