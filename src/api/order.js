import axios from "./request"
import { formatParams } from "@/utils/common.js"


// 订单管理 --------------------------
// 获取订单列表
export const getOrderList = (page, data) => {
  return axios.get(`/admin/order/${page}` + formatParams(data))
}
// 删除订单
export const deleteOrder = (ids) => axios.post("/admin/order/delete_all", { ids })
// 导出订单
export const exportOrder = (data) => {
  return axios.post("/admin/order/excelexport" + formatParams(data), {
    responseType: "blob"
  })
}
// 查看订单物流信息
export const getShipInfo = (id) => axios.get(`/admin/order/${id}/get_ship_info`)
// 拒绝/同意退款
export const refundOrder = (id, data) => axios.post(`/admin/order/${id}/handle_refund`, data)


// 评论管理 --------------------------
// 获取评论列表
export const getGoodsCommentList = (page, data) => {
  return axios.get(`/admin/goods_comment/${page}` + formatParams(data))
}
// 修改状态
export const updateGoodsCommentStatus = (id, status) => axios.post(`/admin/goods_comment/${id}/update_status`, { status })
// 回复商品评价
export const reviewGoodsComment = (id, data) => axios.post(`/admin/goods_comment/review/${id}`, { data })
