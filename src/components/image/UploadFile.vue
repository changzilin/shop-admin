<template>
  <el-upload drag :action="uploadImageUrl" multiple :headers="{ token }" name="img" :data="data"
    :on-success="uploadSuccess" :on-error="uploadError">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      将文件拖到此处或 <em>单击上载</em>
    </div>
  </el-upload>
</template>

<script setup>
import { uploadImageUrl } from "@/api/image.js"
import { getToken } from "@/utils/token.js"
import { notification } from "@/utils/common.js"
const token = getToken()

const emit = defineEmits(["success", "error"])
// 上传成功
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", { response, uploadFile, uploadFiles })
}
// 上传失败
const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败"
  notification(msg, "error")
}

defineProps({
  data: Object
})
</script>