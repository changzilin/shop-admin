<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag v-for="(item, i) in tags" :key="i" @click="handleChoose(item.value)"
            :checked="current == item.value" style="margin-right: 8px">
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <div ref="chart" id="chart" style="width: 100%;height:300px;"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent } from 'echarts/components';
import { ToolboxComponent } from 'echarts/components';
import { getStatistics3 } from "@/api/index.js"
import { useResizeObserver } from '@vueuse/core'
echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent, ToolboxComponent]);

let chart = ref(null);
let myChart = null
// 初始化图表
onMounted(() => {
  let chart = document.querySelector("#chart")
  if (chart) {
    myChart = echarts.init(chart);
    setChart()
  }
})

// 销毁实例
onBeforeUnmount(() => {
  if (myChart) myChart.dispose()
})

// 图表切换
let current = ref("week")
const tags = [
  {
    text: "近1个月",
    value: "month"
  },
  {
    text: "近1周",
    value: "week"
  },
  {
    text: "近24小时",
    value: "hour"
  }
]
function handleChoose(type) {
  current.value = type
  setChart()
}

// 设置图表的数据
async function setChart() {
  let option = {
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
    toolbox: {
      feature: { saveAsImage: { title: "保存为图片" } }
    }
  }
  myChart.showLoading()
  try {
    let res = await getStatistics3(current.value)
    option.xAxis.data = res.x
    option.series[0].data = res.y
  } finally {
    myChart.hideLoading();
  }
  option && myChart.setOption(option);
}

// 页面大小变化的时候
useResizeObserver(chart, () => { myChart && myChart.resize() })
</script>