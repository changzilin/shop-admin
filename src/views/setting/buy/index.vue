<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="85px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="pay">
          <el-table :data="tableData" border>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image :src="row.src" fit="cover" class="rounded mr-2" style="width: 40px;height: 40px;"></el-image>
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="text-gray-500">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openConfig(row.key)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="shopping">
          <el-form-item label="未支付订单">
            <div class="w-full">
              <el-input v-model="form.close_order_minute" type="number" class="order-input">
                <template #append>分钟后自动关闭</template>
              </el-input>
              <small class="point-small">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small>
            </div>
          </el-form-item>
          <el-form-item label="已发货订单">
            <div class="w-full">
              <el-input v-model="form.auto_received_day" type="number" placeholder="已发货订单" class="order-input">
                <template #append>天后自动确认收货</template>
              </el-input>
              <small class="point-small">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small>
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div class="w-full">
              <el-input v-model="form.after_sale_day" type="number" placeholder="未支付订单" class="order-input">
                <template #append>天内允许申请售后</template>
              </el-input>
              <small class="point-small">订单完成后 ，用户在n天内可以发起售后申请，设置0不允许申请售后</small>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 配置 -->
    <FormDrawer ref="formDrawerRef" title="配置" size="45%" destroyOnClose @submit="submit">
      <!-- 支付宝 -->
      <el-form v-if="drawerType == 'alipay'" :model="form" label-width="70" style="width: 98%;">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id" placeholder="app_id"></el-input>
        </el-form-item>
        <el-form-item label="公钥">
          <el-input v-model="form.alipay.ali_public_key" type="textarea" :rows="4" placeholder="公钥">
          </el-input>
        </el-form-item>
        <el-form-item label="私钥">
          <el-input v-model="form.alipay.private_key" type="textarea" :rows="4" placeholder="私钥"></el-input>
        </el-form-item>
      </el-form>
      <!-- 微信 -->
      <el-form v-else :model="form" label-width="115" style="width: 98%;">
        <el-form-item label="公众号 APPID">
          <el-input v-model="form.wxpay.app_id" placeholder="app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID">
          <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 secret">
          <el-input v-model="form.wxpay.secret" placeholder="secret"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid" placeholder="appid"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id" placeholder="商户号"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥">
          <el-input v-model="form.wxpay.key" placeholder="API 密钥"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem"
            :on-success="uploadClientSuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500 truncate">{{ form.wxpay.cert_client ? form.wxpay.cert_client : "还未配置" }}</p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem" :on-success="uploadKeySuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">{{ form.wxpay.cert_key ? form.wxpay.cert_key : "还未配置" }}</p>
              <div class="el-upload__tip">例如：apiclient_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { notification } from "@/utils/common.js"
import { getToken } from "@/utils/token.js"
import { getSysconfig, setSysconfig, uploadAction } from "@/api/sysconfig.js"
const token = getToken()

// 表单数据
const form = reactive({
  close_order_minute: 0, //未支付订单自动关闭时间：分钟，0不自动关闭
  auto_received_day: 0, //已发货订单自动确认时间：天，0不自动收货
  after_sale_day: 0, //已完成订单允许申请售后：天
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: ""
  }, //支付宝支付配置 { app_id:"", ali_public_key:"", private_key:""}
  wxpay: {
    app_id: "",
    miniapp_id: "",
    secret: "",
    appid: "",
    mch_id: "",
    key: "",
    cert_client: "",
    cert_key: ""
  } //微信支付配置 { app_id:'', // 公众号 APPID miniapp_id:'', // 小程序 APPID secret:"", // 小程序secret appid:'', // appid mch_id:'', // 商户号 key:'', // API 密钥 cert_client:'', cert_key:'' }
})

// 标签页切换
const activeName = ref("pay")

// 表格数据
const tableData = [
  {
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/static/alipay.png",
    key: "alipay"
  },
  {
    name: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "/static/wepay.png",
    key: "wxpay"
  }
]

// 获取数据
const loading = ref(false)
async function getData() {
  loading.value = true
  try {
    let res = await getSysconfig()
    for (const key in form) {
      form[key] = res[key]
    }
  } finally {
    loading.value = false
  }
}
getData()

// 支付配置
const drawerType = ref("alipay")
const formDrawerRef = ref(null)

// 保存设置
async function submit() {
  loading.value = true
  if (activeName.value == "pay") formDrawerRef.value.showLoading()
  try {
    await setSysconfig(form)
    notification("修改成功")
    getData()
    if (activeName.value == "pay") formDrawerRef.value.close()
  } finally {
    loading.value = false
    if (activeName.value == "pay") formDrawerRef.value.hideLoading()
  }
}

// 打开配置
function openConfig(key) {
  drawerType.value = key
  formDrawerRef.value.open()
}

// cert_client上传成功
function uploadClientSuccess(response) {
  form.wxpay.cert_client = response.data
}

// cert_key上传成功
function uploadKeySuccess(response) {
  form.wxpay.cert_key = response.data
}

</script>

<style scoped>
.order-input {
  width: 25%;
  min-width: 250px;
}
</style>
