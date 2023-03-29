<template>
  <el-row class="login-container">
    <!-- 左边 -->
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>欢迎光临</div>
        <div>我本非随便的人，如果你想随便，那我就随你的便好啦！</div>
      </div>
    </el-col>
    <!-- 右边 -->
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <!-- 表单 -->
      <el-form :model="form" class="w-[250px]" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit" class="w-[250px]" round color="#626aef">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { notification } from "@/utils/common.js"
const router = useRouter()
const store = useStore()

// 表单数据
const form = reactive({
  username: "",
  password: ""
})
// 表单校验
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
})

let formRef = ref(null)
let loading = ref(false)
// 提交
function submit() {
  formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      await store.dispatch("userLogin", form)
      notification("登录成功！")
      // 跳转首页
      router.push("/")
    } finally {
      loading.value = false
    }
  })
}

// 添加键盘监听
onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
})
// 移除事件
onUnmounted(() => {
  document.removeEventListener("keyup", onKeyUp)
})
function onKeyUp(event) {
  if (event.key == "Enter") submit()
}
</script>

<style scoped>
.login-container {
  @apply bg-indigo-500 min-h-screen;
}

.login-container .left,
.login-container .right {
  @apply flex items-center justify-center;
}

.login-container .right {
  @apply bg-light-50 flex-col;
}

.left>div>div:first-child {
  @apply font-bold text-5xl text-light-50 mb-5;
}

.left>div>div:last-child {
  @apply text-gray-200 text-sm;
}

.right .title {
  @apply font-bold text-3xl text-gray-800;
}

.right>div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>