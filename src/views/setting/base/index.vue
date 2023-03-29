<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="130px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册与访问" name="visit">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio :label="1" border>开启</el-radio>
              <el-radio :label="0" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio label="username" border>普通注册</el-radio>
              <el-radio label="phone" border>手机注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input-number v-model="form.password_min" :precision="0" :min="1" controls-position="right"
              placeholder="密码最小长度">
            </el-input-number>
          </el-form-item>
          <el-form-item label="密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox label="0" border>数字</el-checkbox>
              <el-checkbox label="1" border>小写字母</el-checkbox>
              <el-checkbox label="2" border>大写字母</el-checkbox>
              <el-checkbox label="3" border>符号</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传设置" name="upload">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="oss" border>对象存储</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input v-model="form.upload_config.Bucket" placeholder="Bucket" style="width: 40%;"></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" style="width: 40%;"></el-input>
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" style="width: 40%;"></el-input>
          </el-form-item>
          <el-form-item label="空间域名">
            <div class="w-full">
              <el-input v-model="form.upload_config.http" placeholder="http" style="width: 40%;"></el-input>
              <small class="point-small">请补全http:// 或 https://</small>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Api安全" name="safe">
          <el-form-item label="是否开启API安全">
            <div class="w-full">
              <el-radio-group v-model="form.api_safe">
                <el-radio :label="1" border>开启</el-radio>
                <el-radio :label="0" border>关闭</el-radio>
              </el-radio-group>
              <small class="point-small">api安全功能开启之后调用前端api需要传输签名串</small>
            </div>
          </el-form-item>
          <el-form-item label="秘钥">
            <div class="w-full">
              <el-input v-model="form.api_secret" placeholder="秘钥" style="width: 50%;"></el-input>
              <small class="point-small">秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small>
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { notification } from "@/utils/common.js"
import { getSysconfig, setSysconfig } from "@/api/sysconfig.js"

// 表单数据
const form = reactive({
  open_reg: 1, //开启注册，0关闭1开启
  reg_method: "username", //注册方式，username普通phone手机
  password_min: 7, //密码最小长度
  password_encrypt: [], //密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
  upload_method: "oss", //上传方式，oss对象存储
  upload_config: {
    Bucket: "",
    ACCESS_KEY: "",
    SECRET_KEY: "",
    http: ""
  }, //上传配置 { Bucket:"", ACCESS_KEY:"", SECRET_KEY:"", http:""}
  api_safe: 1, //api安全，0关闭1开启
  api_secret: ""  //秘钥
})

// 标签页切换
const activeName = ref("visit")

// 获取数据
const loading = ref(false)
async function getData() {
  loading.value = true
  try {
    let res = await getSysconfig()
    for (const key in form) {
      form[key] = res[key]
    }
    form.password_encrypt = form.password_encrypt.split(",")
  } finally {
    loading.value = false
  }
}
getData()

// 保存设置
async function submit() {
  loading.value = true
  try {
    await setSysconfig({
      ...form,
      password_encrypt: form.password_encrypt.join(",")
    })
    notification("修改成功")
    getData()
  } finally {
    loading.value = false
  }
}

</script>
