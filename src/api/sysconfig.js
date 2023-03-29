import axios from "./request"


// 基础设置 --------------------------
// 获取原有系统设置
export const getSysconfig = () => axios.get("/admin/sysconfig")
// 修改系统设置
export const setSysconfig = (data) => axios.get("/admin/sysconfig", data)
// 上传文件
export const uploadAction = `${import.meta.env.VITE_APP_BASE_API}/admin/sysconfig/upload`
