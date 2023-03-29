const key = "admin-token"
// 设置
export function setToken(token) {
  return localStorage.setItem(key, token)
}
// 获取
export function getToken() {
  return localStorage.getItem(key)
}
// 删除
export function removeToken() {
  return localStorage.removeItem(key)
}