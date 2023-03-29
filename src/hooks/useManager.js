import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { updatepassword, logout } from "@/api/manager.js"
import { notification, showModal } from "@/utils/common.js"

// 修改密码
export function useRepassword() {
  const store = useStore()
  const router = useRouter()
  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
  })
  // 表单校验
  const rules = reactive({
    oldpassword: [
      { required: true, message: '旧密码不能为空', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '新密码', trigger: 'blur' }
    ],
    repassword: [
      { required: true, message: '确认密码', trigger: 'blur' }
    ]
  })
  let formRef = ref(null)
  let formDrawer = ref(null)
  // 提交
  const onSubmit = () => {
    formRef.value.validate(async valid => {
      if (!valid) return
      formDrawer.value.showLoading()
      try {
        await updatepassword(form)
        await store.dispatch("logout")
        router.push("/login")
        notification("修改密码成功，请重新登录！")
      } catch (error) {
      } finally {
        formDrawer.value.hideLoading()
      }
    })
  }
  const openRepassword = () => formDrawer.value.open()
  return {
    form, rules, formRef, formDrawer, onSubmit, openRepassword
  }
}

// 退出登录
export function useLogout() {
  const store = useStore()
  const router = useRouter()
  const handleLogout = () => {
    showModal("是否要退出登录？").then(() => {
      logout().finally(async () => {
        await store.dispatch("logout")
        router.push("/login")
        notification("退出登录成功！")
      })
    })
  }
  return { handleLogout }
}

