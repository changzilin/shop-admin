<template>
  <div>
    <!-- 标签页 -->
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
    </el-tabs>
    <!-- 主体 -->
    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <Search :model="searchForm" @search="getData" @reset="resetSearchForm">
        <SearchItem label="关键词">
          <el-input v-model="searchForm.title" placeholder="商品名称" clearable />
        </SearchItem>
        <template #expand>
          <SearchItem label="商品分类">
            <el-select v-model="searchForm.category_id" clearable placeholder="请选择商品分类">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>
      <!-- 新增|刷新 -->
      <ListHeader layout="add,refresh" @add="handleCreate" @refresh="getData">
        <el-button v-if="searchForm.tab != 'delete'" type="danger" @click="handleMultiDelete">批量删除</el-button>
        <el-button v-else type="warning" @click="handleRestoreGoods">恢复商品</el-button>
        <el-popconfirm v-if="searchForm.tab == 'delete'" title="是否彻底删除该商品？" width="185" confirm-button-text="删除"
          cancel-button-text="取消" @confirm="handleDestroyGoods">
          <template #reference>
            <el-button type="danger">彻底删除</el-button>
          </template>
        </el-popconfirm>
        <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" type="success"
          @click="handleMultiChangeStatus(1)">上架
        </el-button>
        <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" type="warning"
          @click="handleMultiChangeStatus(0)">下架
        </el-button>
      </ListHeader>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column label="商品" min-width="300">
          <template #default="{ row }">
            <div class="flex">
              <el-image :src="row?.cover ?? ''" class="mr-3 rounded" :preview-src-list="[row.cover]" :initial-index="0"
                preview-teleported hide-on-click-modal fit="cover" style="width: 90px;height:80px;">
              </el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
                </div>
                <p class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : "未分类" }}</p>
                <p class="text-gray-400 text-xs mb-1">创建时间:{{ row.create_time }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sale_count" label="实际销量" min-width="80" align="center"></el-table-column>
        <el-table-column label="商品状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? "上架" : '仓库' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="searchForm.tab != 'delete'" label="审核状态" min-width="150" align="center">
          <template #default="{ row }">
            <div v-if="row.ischeck == 0" class="flex flex-col">
              <el-button size="small" type="success" :loading="row.resolveLoading" plain
                @click="handleCheckGoods(row, 1)">审核通过
              </el-button>
              <el-button class="mt-2 !ml-0" size="small" :loading="row.rejectLoading" type="danger" plain
                @click="handleCheckGoods(row, 2)">审核拒绝
              </el-button>
            </div>
            <el-tag v-else size="small" :type="row.ischeck == 1 ? 'success' : 'danger'">
              {{ row.ischeck == 1 ? "通过" : "拒绝" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="总库存" min-width="100" align="center" />
        <el-table-column label="操作" min-width="400" align="center">
          <template #default="{ row }">
            <div v-if="searchForm.tab != 'delete'">
              <el-button class="px-2" size="small" type="warning" @click="handleEdit(row)">修改</el-button>
              <el-button class="px-2" size="small"
                :type="(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length) ? 'danger' : 'primary'"
                :loading="row.skusLoading" @click="setGoodsSkus(row)">商品规格
              </el-button>
              <el-button class="px-2" size="small" :type="row.goods_banner.length == 0 ? 'danger' : 'primary'"
                :loading="row.bannersLoading" @click="setGoodsBanners(row)">设置轮播图
              </el-button>
              <el-button class="px-2" size="small" :type="row.content ? 'primary' : 'danger'"
                :loading="row.contentLoading" @click="setGoodsContent(row)">商品详情
              </el-button>
              <el-popconfirm title="是否删除该商品？" width="171" confirm-button-text="删除" cancel-button-text="取消"
                @confirm="handleDelete([row.id])">
                <template #reference>
                  <el-button class="px-2" size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <span v-else>暂无操作</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-5">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="searchForm.limit"
          :page-sizes="[10, 20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="getData" />
      </div>
      <!-- 新增|修改 -->
      <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="85px" style="width: 98%;">
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称,不能超过60个字符" />
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover"></ChooseImage>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="选择所属商品分类">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input v-model="form.desc" type="textarea" placeholder="选填,商品卖点" />
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" style="width: 60%;" />
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 60%;">
              <template #append>{{ form.unit }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 60%;">
              <template #append>{{ form.unit }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 60%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice" type="number" style="width: 60%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0" border>隐藏</el-radio>
              <el-radio :label="1" border>显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0" border>放入仓库</el-radio>
              <el-radio :label="1" border>立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
    <!-- 设置轮播图 -->
    <Banners ref="bannersRef" @reloadData="getData"></Banners>
    <!-- 商品详情 -->
    <Content ref="contentRef" @reloadData="getData"></Content>
    <!-- 商品规格 -->
    <Skus ref="skusRef" @reloadData="getData"></Skus>
  </div>
</template>

<script setup>
import { ref } from "vue"
import ChooseImage from "@/components/image/ChooseImage.vue"
import ListHeader from "@/components/table/ListHeader.vue"
import Search from "@/components/search/Search.vue"
import SearchItem from "@/components/search/SearchItem.vue"
import Banners from "./components/Banners.vue"
import Content from "./components/Content.vue"
import Skus from "./components/Skus.vue"
import { getCategoryList } from "@/api/category.js"
import { notification } from "@/utils/common.js"
import {
  getGoodsList, updateGoods, addGoods, deleteGoods, updateGoodsStatus, restoreGoods,
  destroyGoods, checkGoods
} from "@/api/goods.js"
import { useInitTable, useInitForm, useDeleteAndChange } from "@/hooks/useTable.js"

// 列表 | 分页 | 搜索 | 多选 | 批量删除
const optionTable = {
  searchForm: {
    title: null,
    tab: "all",
    category_id: null,
    limit: 10
  },
  getList: getGoodsList,
  delete: deleteGoods,
  updateMultiStatus: updateGoodsStatus,
  onGetListSuccess: handleSuccess
}
const { searchForm, resetSearchForm, tableData, loading, handleSizeChange, currentPage,
  total, getData, handleSelectionChange, handleMultiDelete, handleMultiChangeStatus,
  multiSelectionIds
} = useInitTable(optionTable)
// 处理响应结果
function handleSuccess(res) {
  tableData.value = res.list.map(item => {
    item.bannersLoading = false
    item.contentLoading = false
    item.skusLoading = false
    item.resolveLoading = false
    item.rejectLoading = false
    return item
  })
  total.value = res.totalCount
}

// 新增 | 修改
const optionForm = {
  form: {
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 0 //最低原价
  },
  getData,
  update: updateGoods,
  add: addGoods
}
const { formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate,
  handleEdit
} = useInitForm(optionForm)

// 删除 | 修改状态
const option = { loading, getData, delete: deleteGoods }
const { handleDelete } = useDeleteAndChange(option)

// all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabbars = [
  {
    key: "all",
    name: "全部"
  },
  {
    key: "checking",
    name: "审核中"
  },
  {
    key: "saling",
    name: "出售中"
  },
  {
    key: "off",
    name: "已下架"
  },
  {
    key: "min_stock",
    name: "库存预警"
  },
  {
    key: "delete",
    name: "回收站"
  }
]

// 商品分类
const category_list = ref([])
getCategoryList().then(res => category_list.value = res)

// 审核商品
async function handleCheckGoods(row, ischeck) {
  let attr = ischeck == 1 ? "resolveLoading" : "rejectLoading"
  row[attr] = true
  try {
    await checkGoods(row.id, { ischeck })
    notification("审核成功")
    getData()
  } finally {
    row[attr] = false
  }
}

// 设置轮播图
const bannersRef = ref(null)
const setGoodsBanners = row => bannersRef.value.open(row)

// 设置详情
const contentRef = ref(null)
const setGoodsContent = row => contentRef.value.open(row)

// 设置商品规格
const skusRef = ref(null)
const setGoodsSkus = row => skusRef.value.open(row)

// 恢复商品
const handleRestoreGoods = () => useMultiAction(restoreGoods, "恢复成功")

// 彻底删除
const handleDestroyGoods = () => useMultiAction(destroyGoods, "彻底删除成功")

// 恢复商品 | 彻底删除
async function useMultiAction(fun, msg) {
  if (multiSelectionIds.value.length == 0) return notification("请先选择商品", "error")
  loading.value = true
  try {
    await fun(multiSelectionIds.value)
    notification(msg)
    multiSelectionIds.value = []
    getData()
  } finally {
    loading.value = false
  }
}

</script>
