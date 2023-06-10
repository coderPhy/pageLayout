<template>
  <div class="page-layout">
    <page-search
      :searchFormConfig="searchFormConfig"
      :searchFormData="searchFormData"
      @searchFormDataUpdate="searchFormDataUpdate"
    ></page-search>
    <page-content
      ref="pageContentRef"
      :contentTableConfig="contentTableConfig"
      :getContentTableData="getContentTableData"
      @tableItemCurrentChange="tableCurrentChange"
    >
      <template v-for="slotItem in slotList" key="slotItem" #[slotItem]="scope">
        <slot :name="slotItem" :row="scope.row">
          {{ scope.row[slotItem] }}
        </slot>
      </template>
      <template #header>
        <div class="header">
          <div class="headerLeft">
            <template v-if="!isChangeSearchFormData">全部数据</template>
            <template v-else>
              <el-tooltip :content="filterText" placement="top">
                筛选条件:{{ filterText }}
              </el-tooltip>
              <el-link
                type="info"
                class="clearCondition"
                @click="clearConditionClick"
                >清空</el-link
              >
            </template>
          </div>
          <div class="headerRight">
            <slot name="button"> </slot>
          </div>
        </div>
      </template>
    </page-content>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  useSlots
} from "vue"

import pageSearch from "@/components/page-search"
import pageContent from "@/components/page-content"

const slots = useSlots()
const slotList = computed(() => Object.keys(slots))

const props = defineProps({
  searchFormConfig: {
    type: Object,
    default: () => ({
      formItems: []
    })
  },
  contentTableConfig: {
    type: Object,
    default: () => ({})
  },
  getDataListFn: {
    type: Function,
    default: () => function () {}
  }
})
const emits = defineEmits(["newTableItem", "tableItemCurrentChange"])

const pageContentRef = ref(null)
const searchFormData = ref({})
// 是否有筛选条件
const isChangeSearchFormData = computed(
  () =>
    Object.keys(searchFormData.value).filter(
      (formItem) =>
        searchFormData.value[formItem] !==
          props.searchFormConfig.formItems.find(
            (item) => item.field === formItem
          )?.default ?? ""
    ).length
)

const filterText = computed(() =>
  props.searchFormConfig.formItems
    .map((item) => {
      if (
        searchFormData.value[item.field] &&
        searchFormData.value[item.field] !== (item?.default ?? "")
      ) {
        if (item.type === "input") {
          return item.label + ":" + searchFormData.value[item.field]
        } else if (item.type === "select") {
          return (
            item?.label +
            ":" +
            item.options.find(
              (optionItem) =>
                optionItem.value === searchFormData.value[item.field]
            ).label
          )
        }
      }
    })
    .filter((item) => item)
    .join("、")
)

// 设置默认筛选条件
function setSearchDataDefaultValue() {
  props.searchFormConfig?.formItems?.forEach((item) => {
    searchFormData.value[item.field] = item?.default ?? ""
  })
}
setSearchDataDefaultValue()

// 筛选条件更新
function searchFormDataUpdate(value) {
  searchFormData.value = value
  pageContentRef.value.getTableData()
}
// 清除筛选条件
function clearConditionClick() {
  setSearchDataDefaultValue()
  pageContentRef.value.getTableData()
}

// 定义请求数据方法
const getContentTableData = async ({ currentPage, pageSize }) => {
  const res = await props.getDataListFn({
    offset: (currentPage - 1) * pageSize,
    count: pageSize,
    ...searchFormData.value
  })
  return res.data
}
// 请求数据方法
const getTableData = async () => {
  await pageContentRef.value.getTableData()
}

function tableCurrentChange(value) {
  emits("tableItemCurrentChange", value)
}

defineExpose({
  pageContentRef,
  getTableData
})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 60px;
  line-height: 60px;
  .headerLeft,
  .headerRight {
    display: inline-block;
  }
  .headerLeft {
    flex: 1;
    float: left;
    padding: 10px 10px;
    color: rgb(82, 66, 46);
    .clearCondition {
      margin-left: 10px;
    }
  }
  .headerRight {
    flex: 1;
    float: right;
    text-align: right;
    padding: 0 43px;
  }
}
</style>
