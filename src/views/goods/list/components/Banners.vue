<template>
  <el-drawer v-model="drawerVisible" title="设置轮播图" destroy-on-close size="50%">
    <el-form :model="form" label-width="60px">
      <el-form-item label="轮播图">
        <ChooseImage v-model="form.banners" :limit="9"></ChooseImage>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import ChooseImage from "@/components/image/ChooseImage.vue"
import { notification } from "@/utils/common.js"
import { readGoods, setGoodsBanner } from "@/api/goods.js"

const drawerVisible = ref(false)

const form = reactive({
  banners: []
})

const goodsId = ref(0)
// 打开
async function open(row) {
  row.bannersLoading = true
  goodsId.value = row.id
  try {
    let res = await readGoods(goodsId.value)
    form.banners = res.goodsBanner.map(item => item.url)
    drawerVisible.value = true
  } finally {
    row.bannersLoading = false
  }
}

const emit = defineEmits(["reloadData"])
const loading = ref(false)
// 提交
async function submit() {
  loading.value = true
  try {
    await setGoodsBanner(goodsId.value, form)
    notification("设置轮播图成功")
    drawerVisible.value = false
    emit("reloadData")
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

