<template>
  <div class="form">
    <el-form :label-width="labelWidth">
      <el-row>
        <template v-for="item in formItems" :key="item.label">
          <el-col v-bind="colLayout">
            <el-form-item
              :style="computedItemStyle"
              :label="item.label"
              :rules="item.rules"
            >
              <template v-if="item.type === 'input'">
                <!-- 这里的modeValue是由search.config.js中的formItems中
                  每一项的field作为属性组装成的对象 -->
                <el-input
                  :modelValue="modelValue[`${item.field}`]"
                  @update:modelValue="handleValueChange($event, item.field)"
                  size="large"
                  clearable
                  :placeholder="item.placeholder"
                  v-bind="item.otherOptions"
                ></el-input>
                <!-- otherOptions为el-input中的属性对象 -->
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select
                  :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="handleValueChange($event, item.field)"
                  style="width: 100%"
                  clearable
                  :placeholder="item.placeholder"
                  v-bind="item.otherOptions"
                >
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label"
                  >
                  </el-option>
                </el-select>
              </template>
              <template v-if="item.type === 'datepicker'">
                <el-date-picker
                  style="width: 100%"
                  :modelValue="modelValue[`${item.field}`]"
                  @update:modelValue="handleValueChange($event, item.field)"
                  :placeholder="item.placeholder"
                  v-bind="item.otherOptions"
                ></el-date-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue"
import _ from "lodash"

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  formItems: {
    type: Array,
    default: () => []
  },
  labelWidth: {
    type: String || Number,
    default: "60px"
  },
  itemStyle: {
    type: Object
  },
  colLayout: {
    type: Object,
    default: () => ({ xs: 24, sm: 24, md: 12, lg: 8, xl: 8 })
  }
})

const defaultItemStyle = ref({
  padding: "10px 40px"
})
const computedItemStyle = _.assign({}, defaultItemStyle.value, props.itemStyle)

const emits = defineEmits(["update:modelValue"])
// 更新pageSearch层的formData,
// pageSearch的formData变化了再更新layout层的searchFormData
const handleValueChange = (value, field) => {
  emits("update:modelValue", { ...props.modelValue, [field]: value })
}

</script>

<style lang="less" scoped></style>
