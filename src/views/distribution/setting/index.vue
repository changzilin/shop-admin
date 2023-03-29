<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="100px">
      <h5 class="config-title">基础设置</h5>
      <el-form-item label="分销启用">
        <div class="w-full">
          <el-radio-group v-model="form.distribution_open">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
          <small class="point-small">关闭分销功能后不会再产生新的分销佣金，商城端分销入口会关闭。</small>
        </div>
      </el-form-item>
      <el-form-item label="分销海报图">
        <ChooseImage v-model="form.spread_banners" :limit="6"></ChooseImage>
      </el-form-item>
      <h5 class="config-title">返佣设置</h5>
      <el-form-item label="一级返佣比例">
        <div class="w-full">
          <el-input v-model="form.store_first_rebate" type="number" placeholder="一级返佣比例" style="width: 20%;">
            <template #append>%</template>
          </el-input>
          <small class="point-small">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
        </div>
      </el-form-item>
      <el-form-item label="二级返佣比例">
        <div class="w-full">
          <el-input v-model="form.store_second_rebate" type="number" placeholder="二级返佣比例" style="width: 20%;">
            <template #append>%</template>
          </el-input>
          <small class="point-small">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
        </div>
      </el-form-item>
      <el-form-item label="自购返佣">
        <div class="w-full">
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio :label="1" border>是</el-radio>
            <el-radio :label="0" border>否</el-radio>
          </el-radio-group>
          <small class="point-small">是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣； 关闭：分销员自己购买商品没有返佣）</small>
        </div>
      </el-form-item>
      <h5 class="config-title">结算设置</h5>
      <el-form-item label="结算时间">
        <div class="w-full">
          <el-input v-model="form.settlement_days" type="number" placeholder="结算时间" style="width: 25%;">
            <template #prepend>订单完成后</template>
            <template #append>天</template>
          </el-input>
          <small class="point-small">预估佣金结算后无法进行回收，请谨慎设置结算天数</small>
        </div>
      </el-form-item>
      <el-form-item label="佣金到账方式">
        <div class="w-full">
          <el-radio-group v-model="form.brokerage_method">
            <el-radio label="wx" border>自动到微信零钱</el-radio>
            <el-radio label="hand" border>手动到账</el-radio>
          </el-radio-group>
          <small class="point-small">佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</small>
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
import { getConfig, setConfig } from "@/api/distribution.js"
import ChooseImage from "@/components/image/ChooseImage.vue"

// 表单数据
const form = reactive({
  distribution_open: 1, //分销启用:0禁用1启用
  store_first_rebate: 10, //一级返佣比例：0~100
  store_second_rebate: 20, //二级返佣比例：0~100
  spread_banners: [], //分销海报图
  is_self_brokerage: 1, //自购返佣:0否1是
  settlement_days: 7, //结算时间（单位：天）
  brokerage_method: "hand" //佣金到账方式:hand手动,wx微信
})

// 获取数据
const loading = ref(false)
async function getData() {
  loading.value = true
  try {
    let res = await getConfig()
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
    await setConfig(form)
    notification("修改成功")
    getData()
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.config-title {
  @apply bg-gray-100 p-3 mb-5 rounded;
}
</style>