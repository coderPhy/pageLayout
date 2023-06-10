<template>
  <div class="page-content">
    <baseTable
      v-bind="contentTableConfig"
      :dataList="dataList"
      :dataTotal="dataTotal"
      v-model:page="pageInfo"
      @selectionChange="selectionChange"
      @tableCurrentChange="tableCurrentChangeHandler"
    >
      <template
        v-for="propItem in contentTableConfig.propList"
        :key="propItem.prop"
        #[propItem.prop]="scope"
      >
        <slot
          v-if="slotList.includes(propItem.prop)"
          :name="propItem.prop"
          :row="scope.row"
        ></slot>

        <template v-else>
          {{ scope.row[propItem.prop] || "-" }}
        </template>
      </template>

      <template #tableHeader>
        <slot name="header"> </slot>
      </template>
    </baseTable>
  </div>
</template>

<script setup>
import { ref, computed, watch, useSlots, defineExpose } from "vue"

import { ElMessage } from "element-plus"

import baseTable from "@/base-ui/table"
import debounce from "@/utils/debounce"

const props = defineProps({
  contentTableConfig: {
    type: Object,
    required: true
  },
  getContentTableData: {
    type: Function,
    required: true
  }
})
const emits = defineEmits(["tableItemCurrentChange"])
const slots = useSlots()
const slotList = computed(() => Object.keys(slots))

const dataList = ref([])
const dataTotal = ref(0)
// 1.双向绑定pageInfo
const pageInfo = ref({ currentPage: 1, pageSize: 10 })

// 2.请求数据的方法
const getTableDatadebounce = debounce(props.getContentTableData, 500)
// function getTableData() {
//   props
//     .getContentTableData(pageInfo.value)
//     .then((data) => {
//       const { list, total = 0 } = data
//       dataList.value = list
//       dataTotal.value = total
//     })
//     .catch((err) => {
//       ElMessage.warning(err + "" || "错误")
//     })
// }

async function getTableData() {
  try {
    const result = await props.getContentTableData(pageInfo.value)
    const { list, total = 0 } = result
    dataList.value = list
    dataTotal.value = total
  } catch (err) {
    ElMessage.warning(err + "" || "错误")
  }
}

// 3.监听分页器
watch(
  pageInfo,
  () => {
    getTableData()
  },
  {
    immediate: true
  }
)

// 3.抛出事件
const tableCurrentChangeHandler = (value) => {
  emits("tableItemCurrentChange", value)
}
// 多选
const selectionChange = (value) => {}
// 5.暴露属性和方法
defineExpose({
  dataList,
  getTableData: computed(() => getTableData)
})
</script>

<style lang="less" scoped></style>
