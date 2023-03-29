<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <!-- 列表 -->
    <div class="top">
      <div class="aside-list" :class="{ active: item.id == activeId }" v-for="item in list" :key="item.id"
        @click="changeActiveId(item.id)">
        <span class="truncate">{{ item.name }}</span>
        <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="handleEdit(item)">
          <el-icon :size="12">
            <Edit />
          </el-icon>
        </el-button>
        <!-- 删除 -->
        <el-popconfirm title="是否要删除该分类？" width="171" confirm-button-text="删除" cancel-button-text="取消"
          @confirm="handleDelete(item.id)">
          <template #reference>
            <el-button class="px-1" text type="primary" size="small" @click.stop>
              <el-icon :size="12">
                <Close />
              </el-icon>
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <!-- 分页 -->
    <div class="bottom">
      <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-aside>
  <!-- 新增 -->
  <FormDrawer :title="title" ref="formDrawerRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" label-width="80px" :rules="rules" style="width: 98%;">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { getImageList, addImageClass, updateImageClass, deleteImageClass } from "@/api/image.js"
import { notification } from "@/utils/common.js"

// 加载动画
const loading = ref(false)
const list = ref([])
// 选中图库分类id
const activeId = ref(0)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
async function getData(pageNum = null) {
  if (pageNum) currentPage.value = pageNum
  loading.value = true
  try {
    let res = await getImageList(currentPage.value)
    list.value = res.list
    total.value = res.totalCount
    // 默认选中第一个
    if (list.value[0]) {
      changeActiveId(list.value[0].id)
    }
  } finally {
    loading.value = false
  }

}
getData()

let formDrawerRef = ref(null)
let title = ref("新增")
let formRef = ref(null)
let editId = ref(0)
const form = reactive({
  name: "",
  order: 50
})
const rules = {
  name: [{ required: true, message: '图库分类名称不能为空', trigger: 'blur' }]
}
// 新增
const openDrawer = () => {
  title.value = "新增"
  editId.value = 0
  resetForem({ name: "", order: 50 })
  formDrawerRef.value.open()
}
// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    formDrawerRef.value.showLoading()
    try {
      editId.value ? await updateImageClass(editId.value, form) : await addImageClass(form)
      notification(`${title.value}成功！`)
      getData(editId.value ? currentPage.value : 1)  // 更新数据
      editId.value = 0
      formDrawerRef.value.close()
    } finally {
      formDrawerRef.value.hideLoading()
    }
  })
}

// 重置表单
function resetForem(row) {
  // 清除验证状态
  if (formRef.value) formRef.value.clearValidate()
  for (const key in form) {
    form[key] = row[key]
  }
}

// 编辑图库分类
const handleEdit = row => {
  title.value = "编辑"
  editId.value = row.id
  resetForem(row)
  formDrawerRef.value.open()
}

// 删除分类
const handleDelete = async id => {
  loading.value = true
  try {
    await deleteImageClass(id)
    notification("删除成功！")
    getData()
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(["change"])
// 切换分类
function changeActiveId(id) {
  activeId.value = id
  emit("change", id)
}

defineExpose({ openDrawer })
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 50px;
  @apply flex items-center justify-center;
}

.aside-list {
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center p-3 text-sm text-gray-600 cursor-pointer;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>