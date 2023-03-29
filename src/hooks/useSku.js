import { nextTick, ref, computed } from "vue"
import {
  addGoodsSkusCard, updateGoodsSkusCard, deleteGoodsSkusCard, sortGoodsSkusCard,
  addGoodsSkusCardValue, updateGoodsSkusCardValue, deleteGoodsSkusCardValue, chooseAndSetGoodsSkusCard
} from "@/api/goods.js"
import { useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from "@/utils/common.js"

// 当前商品的ID
export const goodsId = ref(0)

// 规格选项列表
export const skuCardList = ref([])

// 规格设置表格
export const skuList = ref([])

// 初始化规格列表选项
export function initSkuCardList(data) {
  skuList.value = data.goodsSkus
  skuCardList.value = data.goodsSkusCard.map(item => {
    item.text = item.name
    item.loading = false
    item.goodsSkusCardValue.map(v => {
      v.text = v.value || "属性值"
      return v
    })
    return item
  })
}

// 添加规格选项
export const btnLoading = ref(false)
export async function addSkuCardEvent() {
  btnLoading.value = true
  try {
    let res = await addGoodsSkusCard({
      goods_id: goodsId.value,
      name: "规格选项",
      order: 50,
      type: 0
    })
    skuCardList.value.push({
      ...res,
      text: res.name,
      loading: false,
      goodsSkusCardValue: []
    })
  } finally {
    btnLoading.value = false
  }
}

// 修改规格选项
export async function handleUpdate(item) {
  item.loading = true
  try {
    await updateGoodsSkusCard(item.id, {
      goods_id: item.goods_id,
      name: item.text,
      order: item.order,
      type: 0
    })
    item.name = item.text
    getTableData()
  } catch (error) {
    item.text = item.name
  } finally {
    item.loading = false
  }
}

// 删除规格选项
export async function handleDelete(item) {
  item.loading = true
  try {
    await deleteGoodsSkusCard(item.id)
    const index = skuCardList.value.findIndex(e => e.id == item.id)
    // 删除成功移除当前的规格选项
    if (index != -1) {
      skuCardList.value.splice(index, 1)
    }
    getTableData()
  } catch (error) {
    item.loading = false
  }
}

// 排序规格选项
export const bodyLoading = ref(false)
export async function sortCard(action, index) {
  // 深拷贝一份数据
  let copyList = JSON.parse(JSON.stringify(skuCardList.value))
  let sort = action == "up" ? useArrayMoveUp : useArrayMoveDown
  sort(copyList, index)

  let sortData = copyList.map((item, i) => {
    return {
      id: item.id,
      order: i + 1
    }
  })
  bodyLoading.value = true
  try {
    await sortGoodsSkusCard({ sortdata: sortData })
    // 请求成功改变数据
    sort(skuCardList.value, index)
    getTableData()
  } finally {
    bodyLoading.value = false
  }
}

// 选择设置规格
export async function chooseSetGoodsSkusCard(id, data) {
  let item = skuCardList.value.find(e => e.id == id)
  item.loading = true
  try {
    let res = await chooseAndSetGoodsSkusCard(id, data)
    item.name = item.text = res.goods_skus_card.name
    item.goodsSkusCardValue = res.goods_skus_card_value.map(v => {
      v.text = v.value || "属性值"
      return v
    })
    getTableData()
  } finally {
    item.loading = false
  }
}

// 初始化规格的值
export function initSkuCardItem(id) {
  const item = skuCardList.value.find(item => item.id == id)

  const loading = ref(false)
  const inputValue = ref('')
  const inputVisible = ref(false)
  const InputRef = ref()

  // 删除规格的值
  async function handleClose(tag) {
    loading.value = true
    try {
      await deleteGoodsSkusCardValue(tag.id)
      let index = item.goodsSkusCardValue.findIndex(e => e.id == tag.id)
      if (index != -1) {
        item.goodsSkusCardValue.splice(index, 1)
      }
      getTableData()
    } finally {
      loading.value = false
    }
  }

  // 显示输入框
  function showInput() {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }

  // 提交
  async function handleInputConfirm() {
    if (!inputValue.value) {
      inputVisible.value = false
      return
    }
    loading.value = true
    try {
      let res = await addGoodsSkusCardValue({
        goods_skus_card_id: id,
        name: item.name,
        order: 50,
        value: inputValue.value
      })
      item.goodsSkusCardValue.push({
        ...res,
        text: res.value
      })
      getTableData()
    } finally {
      inputValue.value = ''
      loading.value = false
      inputVisible.value = false
    }
  }

  // 修改规格的值
  async function handleChange(value, tag) {
    loading.value = true
    try {
      await updateGoodsSkusCardValue(tag.id, {
        goods_skus_card_id: tag.goods_skus_card_id,
        name: tag.name,
        order: tag.order,
        value: value
      })
      tag.value = value
      getTableData()
    } catch (error) {
      tag.text = tag.value
    } finally {
      loading.value = false
    }
  }

  return {
    item, inputValue, inputVisible, InputRef, loading, handleClose, showInput,
    handleInputConfirm, handleChange
  }
}

// 初始化表格
export function initSkuTable() {
  const skuLables = computed(() => skuCardList.value.filter(item => item.goodsSkusCardValue.length > 0))
  // 获取表头
  const tableThs = computed(() => {
    let length = skuLables.value.length
    return [
      { name: "商品规格", colspan: length, rowspan: length > 0 ? 1 : 2, width: "" },
      { name: "销售价", rowspan: 2, width: "100" },
      { name: "市场价", rowspan: 2, width: "100" },
      { name: "成本价", rowspan: 2, width: "100" },
      { name: "库存", rowspan: 2, width: "100" },
      { name: "体积", rowspan: 2, width: "100" },
      { name: "重量", rowspan: 2, width: "100" },
      { name: "编码", rowspan: 2, width: "100" }
    ]
  })

  return { skuLables, tableThs, skuList }
}

// 获取规格表格数据
function getTableData() {
  if (skuCardList.value.length == 0) return []

  let list = []
  skuCardList.value.forEach(item => {
    if (item.goodsSkusCardValue && item.goodsSkusCardValue.length > 0) {
      list.push(item.goodsSkusCardValue)
    }
  })

  if (list.length == 0) return []
  let arr = cartesianProductOf(...list)

  // 获取之前的规格列表，将规格ID排序之后转化成字符串
  let beforeSkuList = JSON.parse(JSON.stringify(skuList.value)).map(item => {
    // 对象转为数组
    if (!Array.isArray(item.skus)) {
      item.skus = Object.keys(item.skus).map(k => item.skus[k])
    }
    item.skusId = item.skus.sort((a, b) => a.id - b.id).map(e => e.id).join(",")
    return item
  })

  skuList.value = []
  skuList.value = arr.map(item => {
    let obj = getBeforeSkuItem(JSON.parse(JSON.stringify(item)), beforeSkuList)
    return {
      code: obj?.code || "",
      cprice: obj?.cprice || "0.00",
      goods_id: goodsId.value,
      image: obj?.image || "",
      oprice: obj?.oprice || "0.00",
      pprice: obj?.pprice || "0.00",
      skus: item,
      stock: obj?.stock || 0,
      volume: obj?.volume || 0,
      weight: obj?.weight || 0
    }
  })

}

// 对比
function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus.sort((a, b) => a.id - b.id).map(e => e.id).join(",")
  return beforeSkuList.find(item => {
    if (skus.length > item.skus.length) {
      return skusId.includes(item.skusId)
    }
    return item.skusId.includes(skusId)
  })
}