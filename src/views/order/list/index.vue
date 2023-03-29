<template>
  <div>
    <!-- 标签页 -->
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <SearchItem label="订单编号">
          <el-input v-model="searchForm.no" placeholder="订单编号" clearable />
        </SearchItem>
        <template #expand>
          <SearchItem label="收货人">
            <el-input v-model="searchForm.name" placeholder="收货人" clearable />
          </SearchItem>
          <SearchItem label="手机号">
            <el-input v-model="searchForm.phone" placeholder="手机号" clearable />
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker v-model="searchForm.starttime" value-format="YYYY-MM-DD" type="date" placeholder="开始日期" />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker v-model="searchForm.endtime" value-format="YYYY-MM-DD" type="date" placeholder="结束日期" />
          </SearchItem>
        </template>
      </Search>
      <!-- 新增|刷新 -->
      <ListHeader layout="refresh,download" @refresh="getData" @download="handleExportExcel">
        <el-button type="danger" @click="handleMultiDelete">批量删除</el-button>
      </ListHeader>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="360">
          <template #default="{ row }">
            <div class="flex text-sm">
              <div class="flex-1">
                <p>订单号:</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间:</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div v-for="(item, i) in row.order_items" :key="item.id" class="flex py-2">
              <el-image :src="item.goods_item?.cover" :preview-src-list="[item.goods_item?.cover]" :initial-index="0"
                fit="cover" style="width: 40px;height: 40px;" preview-teleported hide-on-click-modal>
              </el-image>
              <p class="text-blue-500 ml-2">{{ item.goods_item?.title ?? "商品已被删除" }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="实际付款" min-width="120" align="center"></el-table-column>
        <el-table-column label="买家" align="center">
          <template #default="{ row }">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small>(用户ID:{{ row.user.id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" min-width="180" align="center">
          <template #default="{ row }">
            <div>
              付款状态:
              <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
              <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付宝支付</el-tag>
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态:
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? "已发货" : "未发货"
              }}</el-tag>
            </div>
            <div>
              收货状态:
              <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">
                {{ row.ship_data == 'received' ? "已收货" : "未收货" }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="width" align="center">
          <template #default="{ row }">
            <el-button class="px-2" size="small" type="primary" @click="openInfoModal(row)">订单详情</el-button>
            <el-button v-if="searchForm.tab == 'noship'" class="px-2" size="small" type="primary">订单发货</el-button>
            <template v-if="searchForm.tab == 'refunding'">
              <el-button class="px-2" size="small" type="warning" @click="handleRefund(row.id, 1)">同意退款</el-button>
              <el-button class="px-2" size="small" type="danger" @click="handleRefund(row.id, 0)">拒绝退款</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="searchForm.limit"
          :page-sizes="[10, 20, 50, 80]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="getData" />
      </div>
    </el-card>
    <!-- 导出 -->
    <ExportExcel ref="exportExcelRef" :tabs="tabbars"></ExportExcel>
    <!-- 商品详情 -->
    <InfoModal ref="infoModal" :info="info"></InfoModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import ListHeader from "@/components/table/ListHeader.vue"
import Search from "@/components/search/Search.vue"
import SearchItem from "@/components/search/SearchItem.vue"
import ExportExcel from "./ExportExcel.vue"
import InfoModal from "./InfoModal.vue"
import { getOrderList, deleteOrder, refundOrder } from "@/api/order.js"
import { useInitTable } from "@/hooks/useTable.js"
import { notification, showModal, showMessageBox } from "@/utils/common.js"

// 列表 | 分页 | 多选 | 批量删除
const optionTable = {
  searchForm: {
    tab: "all",
    no: null,
    starttime: null,
    endtime: null,
    name: null,
    phone: null,
    limit: 10
  },
  getList: getOrderList,
  delete: deleteOrder,
  onGetListSuccess: handleSuccess
}
const { searchForm, resetSearchForm, tableData, loading, currentPage, total,
  getData, handleSelectionChange, handleMultiDelete, handleSizeChange
} = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    item.bannersLoading = false
    item.contentLoading = false
    item.skusLoading = false
    return item
  })
  total.value = res.totalCount
}

// 操作列的宽度
const width = computed(() => {
  let w = searchForm.tab == 'refunding' ? "260" : (searchForm.tab == 'noship' ? "230" : "")
  return w
})

// all全部，nopay待支付，noship待发货，shiped待收货，received已收货，
// finish已完成，closed已关闭，refunding退款中
const tabbars = [
  {
    key: "all",
    name: "全部"
  },
  {
    key: "nopay",
    name: "待支付"
  },
  {
    key: "noship",
    name: "待发货"
  },
  {
    key: "shiped",
    name: "待收货"
  },
  {
    key: "received",
    name: "已收货"
  },
  {
    key: "finish",
    name: "已完成"
  },
  {
    key: "closed",
    name: "已关闭"
  },
  {
    key: "refunding",
    name: "退款中"
  }
]

// 导出Excel
const exportExcelRef = ref(null)
function handleExportExcel() {
  exportExcelRef.value.open()
}

// 商品详情
const infoModal = ref(null)
const info = ref(null)
// 打开商品详情
function openInfoModal(row) {
  row.order_items = row.order_items.map(e => {
    if (e.skus_type == 1 && e.goods_skus) {
      let arr = []
      for (const key in e.goods_skus.skus) {
        arr.push(e.goods_skus.skus[key].value)
      }
      e.sku = arr.join(",")
    }
    return e
  })
  info.value = row
  infoModal.value.open()
}

// 同意退款 | 拒绝退款
function handleRefund(id, agree) {
  (agree ? showModal("是否要同意该订单退款?") : showMessageBox("请输入拒绝的理由"))
    .then(({ value }) => {
      let data = { agree }
      // 拒绝理由
      if (!agree) data.disagree_reason = value
      refundOrder(id, data).then(res => {
        getData()
        notification("操作成功")
      })
    })
}
</script>
