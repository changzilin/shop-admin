import { ElNotification, ElMessageBox } from 'element-plus'


// 提示相关 --------------------------------------------------------------------
// 消息提示
export function notification(message, type = 'success', dangerouslyUseHTMLString = false) {
  ElNotification({
    message,
    type,
    duration: 3000,
    dangerouslyUseHTMLString
  })
}
// 消息提示框
export function showModal(content, type = "warning", title = "") {
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type,
    }
  )
}
// 消息弹出框
export function showMessageBox(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  })
}

// 存储相关 --------------------------------------------------------------------
// 设置
export function setStorage(key, value, storageType = "local") {
  value = typeof value == "object" ? JSON.stringify(value) : value
  if (storageType == "session") {
    sessionStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, value)
  }
}
// 获取
export function getStorage(key, storageType = "local") {
  if (storageType == "session") {
    return JSON.parse(sessionStorage.getItem(key))
  } else {
    return JSON.parse(localStorage.getItem(key))
  }
}
// 删除
export function removeStorage(key, storageType = "local") {
  if (storageType == "session") {
    localStorage.removeItem(key)
  } else {
    localStorage.removeItem(key)
  }
}


// 商品管理 --------------------------------------------------------------------
// 上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1)
}
// 下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1)
}
// 数组元素调换位置
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(arguments, function(a, b) {
    let ret = [];
    a.forEach(function(a) {
      b.forEach(function(b) {
        ret.push(a.concat([b]));
      });
    });
    return ret;
  }, [[]]);
}

// 格式化 --------------------------------------------------------------------
// 格式化params参数
export function formatParams(data) {
  let arr = []
  for (const key of Object.keys(data)) {
    if (data[key]) {
      arr.push(`${key}=${encodeURIComponent(data[key])}`)
    }
  }
  // for (const key in data) {
  //   if (data[key]) {
  //     arr.push(`${key}=${encodeURIComponent(data[key])}`)
  //   }
  // }
  let params = arr.join("&")
  params = "?" + params
  return params
}
