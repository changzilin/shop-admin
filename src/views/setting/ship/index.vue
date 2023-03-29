<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="100px">
      <el-form-item label="物流查询key">
        <div class="w-full">
          <el-input v-model="form.ship" placeholder="物流查询key" class="w-[35%] min-w-[240px]"></el-input>
          <small class="point-small">用于查询物流信息，接口申请（仅供参考）</small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { notification } from "@/utils/common.js"
import { getSysconfig, setSysconfig } from "@/api/sysconfig.js"

// 表单数据
const form = reactive({ ship: "" })

// 获取数据
const loading = ref(false)
async function getData() {
  loading.value = true
  try {
    let res = await getSysconfig()
    for (const key in form) {
      form[key] = res[key]
    }
  } finally {
    loading.value = false
  }
}
getData()


// 保存设置
async function submit() {
  loading.value = true
  try {
    await setSysconfig(form)
    notification("修改成功")
    getData()
  } finally {
    loading.value = false
  }
}

</script>

