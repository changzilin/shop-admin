<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col :span="6" v-for="(item, index) in list" :key="item.id">
          <el-card shadow="hover" class="mb-3" :class="{ 'border-blue-500': item.checked }"
            :body-style="{ 'padding': 0 }">
            <div class="imgBox">
              <el-image :src="item.url" fit="cover" class="image" preview-teleported hide-on-click-modal
                :preview-src-list="list.map(e => e.url).filter(e => e)" :initial-index="index" />
              <div class="image-title">{{ item.name }}</div>
            </div>
            <!-- 操作 -->
            <div class="flex justify-center items-center p-2">
              <el-checkbox v-if="choose" v-model="item.checked" @change="handleChange(item)"></el-checkbox>
              <el-button type="primary" size="small" text @click="handleRename(item)">重命名</el-button>
              <el-popconfirm title="是否要删除该图片？" width="171" confirm-button-text="删除" cancel-button-text="取消"
                @confirm="handleDelete(item.id)">
                <template #reference>
                  <el-button type="primary" size="small" text class="!m-0">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 分页 -->
    <div class="bottom">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="limit" :page-sizes="[10, 20, 50, 80]"
        background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="getData" />
    </div>
  </el-main>
  <!-- 上传图片 -->
  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id: imageClassId }" @success="uploadSuccess"></UploadFile>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from "vue"
import UploadFile from "./UploadFile.vue"
import { getImageClassList, updateImage, deleteImage } from "@/api/image.js"
import { showMessageBox, notification } from "@/utils/common.js"

const props = defineProps({
  choose: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})

// 加载动画
const loading = ref(false)
// 分页
const list = ref([])
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const imageClassId = ref(0)
// 上传图片
const drawer = ref(false)
const openUploadFile = () => drawer.value = true

// 获取数据
async function getData(pageNum = null) {
  if (pageNum) currentPage.value = pageNum
  loading.value = true
  try {
    let res = await getImageClassList(imageClassId.value, currentPage.value, { limit: limit.value })
    list.value = res.list.map(item => {
      item.checked = false
      return item
    })
    total.value = res.totalCount
  } finally {
    loading.value = false
  }
}

// 页面条数发生变化
function handleSizeChange(size) {
  limit.value = size
  getData()
}

// 根据分类ID重新加载图片
function loadData(id) {
  currentPage.value = 1
  imageClassId.value = id
  getData()
}

// 重命名
const handleRename = async item => {
  try {
    let { value } = await showMessageBox("重命名", item.name)
    await updateImage(item.id, value)
    notification("修改成功！")
    getData()
  } catch (error) { }
}

// 删除图片
const handleDelete = async id => {
  loading.value = true
  try {
    await deleteImage([id])
    notification("删除成功！")
    getData()
  } finally {
    loading.value = false
  }
}

// 上传成功
const uploadSuccess = () => {
  notification("上传成功")
  getData(1)
}

// 选中的图片
const emit = defineEmits(["choose"])
const checkedImg = computed(() => list.value.filter(item => item.checked))
function handleChange(item) {
  // 选中的图片数量大于限制数量
  if (checkedImg.value.length > props.limit) {
    // 如果只选择一张图片就把选中的取消，当前的选中
    if (props.limit == 1) {
      checkedImg.value.forEach(e => e.checked = false)
      item.checked = true
    } else {
      item.checked = false
      return notification(`最多只能选中${props.limit}张`, "error")
    }
  }
  emit("choose", checkedImg.value)
}

defineExpose({ loadData, openUploadFile })
</script>

<style scoped>
.image-main {
  position: relative;
}

.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  height: 50px;
  @apply flex items-center justify-center;
}

.imgBox {
  height: 150px;
  overflow: hidden;
  @apply relative;
}

.imgBox:hover .image {
  transform: scale(1.05);
}

.imgBox .image {
  position: absolute;
  cursor: pointer;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}

.image-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  @apply text-sm truncate text-gray-100 px-2;
}
</style>