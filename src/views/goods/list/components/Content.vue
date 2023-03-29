<template>
  <FormDrawer ref="formDrawerRef" title="设置商品详情" size="60%" destroyOnClose @submit="submit">
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content"></Editor>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import Editor from "@/components/Editor.vue"
import { notification } from "@/utils/common.js"
import { readGoods, updateGoods } from "@/api/goods.js"

const formDrawerRef = ref(null)

const form = reactive({
  content: ""
})

const goodsId = ref(0)
// 打开
async function open(row) {
  row.contentLoading = true
  goodsId.value = row.id
  try {
    let res = await readGoods(goodsId.value)
    form.content = res.content
    formDrawerRef.value.open()
  } finally {
    row.contentLoading = false
  }
}

const emit = defineEmits(["reloadData"])
// 提交
async function submit() {
  formDrawerRef.value.showLoading()
  try {
    await updateGoods(goodsId.value, form)
    notification("设置商品详情成功")
    formDrawerRef.value.close()
    emit("reloadData")
  } finally {
    formDrawerRef.value.hideLoading()
  }
}

defineExpose({ open })
</script>

