<template>
  <el-form-item label="规格设置">
    <table class="sku_table w-[98%]">
      <thead>
        <tr>
          <th v-for="(th, i) in tableThs" :key="i" :width="th.width" :rowspan="th.rowspan" :colspan="th.colspan">{{
            th.name }}</th>
        </tr>
        <tr>
          <th v-for="(th, i) in skuLables" :key="i">{{ th.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in skuList" :key="index">
          <td v-for="(sku, i) in item.skus" :key="i" width="100">{{ sku.value }}</td>
          <td><el-input v-model="item.pprice" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.oprice" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.cprice" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.stock" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.volume" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.weight" size="small" type="number"></el-input></td>
          <td><el-input v-model="item.code" size="small"></el-input></td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import { initSkuTable } from "@/hooks/useSku.js"

// 初始化表格
const { skuLables, tableThs, skuList } = initSkuTable()

</script>

<style scoped>
.sku_table,
.sku_table th,
.sku_table td {
  @apply border text-center;
}
</style>