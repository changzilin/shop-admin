<template>
  <el-drawer v-model="drawerVisible" title="订单详情" size="50%">
    <!-- 订单详情 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">订单详情</strong>
      </template>
      <el-form label-width="70px">
        <el-form-item label="订单号">{{ info.no }}</el-form-item>
        <el-form-item label="付款方式">{{ info.payment_method }}</el-form-item>
        <el-form-item label="付款时间">{{ info.paid_time }}</el-form-item>
        <el-form-item label="创建时间">{{ info.create_time }}</el-form-item>
      </el-form>
    </el-card>
    <!-- 商品信息 -->
    <el-card shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">商品信息</strong>
      </template>
      <div v-for="(item, i) in info.order_items" :key="item.id" class="flex mb-2">
        <el-image :src="item.goods_item?.cover" class="mr-3 rounded"
          :preview-src-list="info.order_items.map(e => e.goods_item?.cover).filter(e => e)" :initial-index="i"
          preview-teleported fit="cover" style="width: 60px;height:60px;">
        </el-image>
        <div class="ml-2 text-sm">
          <p>{{ item.goods_item?.title ?? "商品已被删除" }}</p>
          <p v-if="item.sku" class="mt-1">
            <el-tag type="info" size="small">
              {{ item.sku }}
            </el-tag>
          </p>
          <p>
            <strong class="text-rose-500 mr-2">￥{{ item.price }}</strong>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <el-form label-width="70px">
        <el-form-item label="成交价">
          <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 发货信息 -->
    <el-card v-if="info.ship_data" shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">发货信息</strong>
      </template>
      <el-form label-width="70px">
        <el-form-item label="物流公司">{{ info.ship_data.express_company }}</el-form-item>
        <el-form-item label="运单号">
          {{ info.ship_data.express_no }}
          <el-button class="ml-3" :loading="loading" text type="primary" size="small"
            @click="openShipInfoModal(info.id)">查看物流</el-button>
        </el-form-item>
        <el-form-item label="发货时间">{{ shipTime }}</el-form-item>
      </el-form>
    </el-card>
    <!-- 退款信息 -->
    <el-card v-if="info.refund_status != 'pending'" shadow="never" class="mb-3">
      <template #header>
        <div class="flex items-center">
          <strong class="text-sm">退款信息</strong>
          <el-tag type="warning" class="ml-auto">{{ refundStatus }}</el-tag>
        </div>
      </template>
      <el-form label-width="70px">
        <el-form-item label="退款理由">{{ info.extra.refund_reason }}</el-form-item>
      </el-form>
    </el-card>
    <!-- 收货信息 -->
    <el-card v-if="info.address" class="mb-3" shadow="never">
      <template #header>
        <strong class="text-sm">收货信息</strong>
      </template>
      <el-form label-width="80px">
        <el-form-item label="收货人">{{ info.address.name }}</el-form-item>
        <el-form-item label="联系方式">{{ info.address.phone }}</el-form-item>
        <el-form-item label="收货地址">
          {{ info.address.province + info.address.city + info.address.district + info.address.address }}
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
  <!-- 物流信息 -->
  <ShipInfoModal ref="shipInfoModalRef"></ShipInfoModal>
</template>

<script setup>
import { ref, computed } from "vue"
import { useDateFormat } from '@vueuse/core'
import ShipInfoModal from "./ShipInfoModal.vue"

const props = defineProps({ info: Object })

// 发货时间
const shipTime = computed(() => {
  if (props.info.ship_data.express_time) {
    const time = useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD HH:mm:ss');
    return time.value
  }
  return ""
})

// 退款状态
const refundStatus = computed(() => {
  const opt = {
    pending: "未退款",
    applied: "已申请，等待审核",
    processing: "退款中",
    success: "退款成功",
    failed: "退款失败"
  }
  return props.info.refund_status ? opt[props.info.refund_status] : ""
})

// 隐藏 | 显示
const drawerVisible = ref(false)

// 打开
const open = () => drawerVisible.value = true

// 查看物流信息
const loading = ref(false)
const shipInfoModalRef = ref(null)
async function openShipInfoModal(id) {
  loading.value = true
  try {
    await shipInfoModalRef.value.open(id)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

<style scoped>
:deep(.el-form-item__label) {
  justify-content: flex-start;
}
</style>