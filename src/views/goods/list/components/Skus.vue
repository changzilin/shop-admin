<template>
  <FormDrawer ref="formDrawerRef" title="设置商品规格" size="70%" destroyOnClose @submit="submit">
    <el-form :model="form">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 单规格 -->
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width: 35%;">
            <template #append>kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width: 35%;">
            <template #append>m³</template>
          </el-input>
        </el-form-item>
      </template>
      <!-- 多规格 -->
      <template v-else>
        <SkuCard></SkuCard>
        <SkuTable></SkuTable>
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import SkuCard from "./SkuCard.vue"
import SkuTable from "./SkuTable.vue"
import { notification } from "@/utils/common.js"
import { readGoods, updateGoodsSkus } from "@/api/goods.js"
import { goodsId, initSkuCardList, skuList } from "@/hooks/useSku.js"

const formDrawerRef = ref(null)
const emit = defineEmits(["reloadData"])

const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
})

// 打开 | 获取商品的数据
async function open(row) {
  row.skusLoading = true
  goodsId.value = row.id
  try {
    let res = await readGoods(goodsId.value)
    form.sku_type = res.sku_type
    form.sku_value = res.sku_value || { oprice: 0, pprice: 0, cprice: 0, weight: 0, volume: 0 }
    initSkuCardList(res)
    formDrawerRef.value.open()
  } finally {
    row.skusLoading = false
  }
}

// 提交 | 更新数据
async function submit() {
  formDrawerRef.value.showLoading()
  let data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  }
  // 多规格属性（sku_type=1时必填）
  if (form.sku_type == 1) {
    data.goodsSkus = skuList.value
  }
  console.log(data);
  try {
    await updateGoodsSkus(goodsId.value, data)
    notification("设置商品规格成功")
    formDrawerRef.value.close()
    emit("reloadData")
  } finally {
    formDrawerRef.value.hideLoading()
  }
}

defineExpose({ open })
</script>

