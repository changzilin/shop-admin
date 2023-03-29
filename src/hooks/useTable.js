import { ref, reactive, computed } from "vue"
import { notification } from "@/utils/common.js"

// 列表 | 分页 | 搜索 | 多选 | 批量删除
export function useInitTable(option = {}) {
  // 搜索参数
  let searchForm = null
  let resetSearchForm = null
  // 是否需要搜索
  if (option.searchForm) {
    searchForm = reactive({ ...option.searchForm })
    resetSearchForm = () => {
      for (const key in option.searchForm) {
        searchForm[key] = option.searchForm[key];
      }
      getData()
    }
  }

  // 表格参数
  const tableData = ref([])
  const loading = ref(false)

  // 分页参数
  const currentPage = ref(1)
  const total = ref(0)
  // limit待处理
  const limit = ref(10)

  // 获取数据
  async function getData(pageNum = null) {
    if (typeof pageNum == 'number') currentPage.value = pageNum
    loading.value = true
    try {
      let res = await option.getList(currentPage.value, searchForm)
      // 是否需要处理响应结果
      if (option.onGetListSuccess && typeof option.onGetListSuccess == "function") {
        option.onGetListSuccess(res)
      } else {
        // 默认处理
        tableData.value = res.list
        total.value = res.totalCount
      }
    } finally {
      loading.value = false
    }
  }
  getData()

  // 页面条数发生改变
  function handleSizeChange(size) {
    searchForm.limit = size
    getData()
  }

  // 多选
  const multiSelectionIds = ref([])
  function handleSelectionChange(selection) {
    multiSelectionIds.value = selection.map(item => item.id)
  }

  // 批量删除
  async function handleMultiDelete() {
    if (multiSelectionIds.value.length == 0) return notification("请先选择商品", "error")
    loading.value = true
    try {
      await option.delete(multiSelectionIds.value)
      notification("删除成功")
      multiSelectionIds.value = []
      getData()
    } finally {
      loading.value = false
    }
  }

  // 批量修改状态
  async function handleMultiChangeStatus(status) {
    if (multiSelectionIds.value.length == 0) return notification("请先选择商品", "error")
    loading.value = true
    try {
      await option.updateMultiStatus(multiSelectionIds.value, status)
      notification("修改状态成功")
      multiSelectionIds.value = []
      getData()
    } finally {
      loading.value = false
    }
  }


  return {
    searchForm, resetSearchForm, handleSizeChange, tableData, loading, currentPage,
    total, limit, getData, handleSelectionChange, handleMultiDelete,
    handleMultiChangeStatus, multiSelectionIds
  }
}

// 新增 | 修改
export function useInitForm(option = {}) {
  // 表单部分
  const formDrawerRef = ref(null)
  const formRef = ref(null)
  const form = reactive({ ...option.form })
  // 验证规则
  const rules = option.rules || {}
  // 编辑
  const editId = ref(0)
  const drawerTitle = computed(() => editId.value ? "修改" : "新增")

  // 提交
  function handleSubmit() {
    formRef.value.validate(async valid => {
      if (!valid) return
      formDrawerRef.value.showLoading()
      // 提交之前处理参数
      let body = {}
      if (option.beforeSubmit && typeof option.beforeSubmit == "function") {
        body = option.beforeSubmit({ ...form })
      } else {
        body = form
      }
      try {
        editId.value ? await option.update(editId.value, body) : await option.add(body)
        notification(`${drawerTitle.value}成功`)
        option.getData(editId.value ? false : 1)
        formDrawerRef.value.close()
      } finally {
        formDrawerRef.value.hideLoading()
      }
    })
  }
  // 新增
  function handleCreate() {
    editId.value = 0
    resetForem(option.form)
    formDrawerRef.value.open()
  }
  // 重置表单
  function resetForem(row) {
    // 清除验证状态
    if (formRef.value) formRef.value.clearValidate()
    for (const key in form) {
      form[key] = row[key]
    }
  }
  // 修改
  async function handleEdit(row) {
    editId.value = row.id
    resetForem(row)
    formDrawerRef.value.open()
  }

  return {
    formDrawerRef, formRef, form, rules, drawerTitle, handleSubmit, handleCreate, handleEdit
  }
}

// 删除 | 修改状态
export function useDeleteAndChange(option = {}) {
  // 删除
  async function handleDelete(id) {
    option.loading.value = true
    try {
      await option.delete(id)
      notification("删除成功")
      option.getData()
    } finally { option.loading.value = false }
  }

  // 修改状态
  async function handleChangeStatus(status, row) {
    row.loading = true
    try {
      await option.updateStatus(row.id, status)
      notification("修改状态成功")
      row.status = status
    } catch (error) {
      row.status = status == 1 ? 0 : 1
    } finally { row.loading = false }
  }

  return { handleDelete, handleChangeStatus }
}


