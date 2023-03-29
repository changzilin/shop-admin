import store from "@/store/index.js"

function hasPermission(vlaue, el = false) {
  if (!Array.isArray(vlaue)) {
    throw new Error(`需要配置权限，例如 v-permission="['createRule,POST']"`)
  }
  // hasAuth：是否有权限
  let hasAuth = vlaue.findIndex(item => store.state.ruleNames.includes(item)) != -1
  if (el && !hasAuth) {
    el.remove()
  }
  return hasAuth
}
export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      }
    })
  }
}