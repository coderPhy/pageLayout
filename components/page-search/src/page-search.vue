<template>
  <div class="page-search">
    <baseForm v-bind="searchFormConfig" v-model="formData" ref="formRef">
    </baseForm>
  </div>
</template>

<script setup>
import baseForm from "@/base-ui/form"
import { ref, watch, defineEmits, defineProps } from "vue"

const props = defineProps({
  searchFormConfig: {
    type: Object,
    required: true
  },
  searchFormData: {
    type: Object,
    required: true
  }
})
const emits = defineEmits([
  "resetBtnClick",
  "queryBtnClick",
  "searchFormDataUpdate"
])

const formData = ref(props.searchFormData)
watch(formData, (newValue, oldValue) => {
  emits("searchFormDataUpdate", newValue)
})
// 当用户点击重置
function handleResetClick() {
  formData.value = formOriginData
  emits("resetBtnClick")
}
// 当用户点击搜索
function handleQueryClick() {
  emit("queryBtnClick", formData.value)
}
</script>

<style lang="less" scoped>
.title {
  font-size: 26px;
  text-align: center;
}
.handle-btns {
  text-align: right;
  padding: 10px 45px 20px 0;
}
</style>
