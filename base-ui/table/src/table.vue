<template>
  <div class="table">
    <div class="tableheader">
      <slot name="tableHeader"> </slot>
    </div>
    <el-table
      :data="dataList"
      v-bind="tableStyle"
      @selection-change="selectionChangeHandle"
      @current-change="currentChangeHandle"
    >
      <el-table-column
        v-if="showSelectColumn"
        type="selection"
        align="center"
        width="60px"
      >
      </el-table-column>
      <el-table-column
        v-if="showIndexColumn"
        type="index"
        label="序号"
        align="center"
        width="60px"
      ></el-table-column>
      <template v-for="propItem in propList" :key="propItem.prop">
        <el-table-column v-bind="propItem" align="center" show-overflow-tooltip>
          <template #default="scope">
            <!-- 定义插槽和默认值 -->
            <slot :name="propItem.prop" :row="scope.row">
              {{ scope.row[propItem.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="footer" v-if="showFooter">
      <slot name="footer">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="paginationCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          :layout="paginationLayout"
          :total="dataTotal"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue"

const props = defineProps({
  dataList: {
    type: Array,
    required: true
  },
  dataTotal: {
    type: Number,
    default: 0
  },
  propList: {
    type: Array,
    requiredL: true
  },
  showIndexColumn: {
    type: Boolean,
    default: false
  },
  showSelectColumn: {
    type: Boolean,
    dafault: false
  },
  page: {
    type: Object,
    default: () => ({ currentPage: 0, pageSize: 10 })
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  paginationLayout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper"
  },
  tableStyle: {
    type: Object,
    default: () => ({
      border: true,
      highlightCurrentRow: true
    })
  }
})
const emits = defineEmits([
  "update:page",
  "selectionChange",
  "tableCurrentChange"
])

const currentChangeHandle = (value) => {
  emits("tableCurrentChange", value)
}

const selectionChangeHandle = (value) => {
  emits("selectionChange", value)
}
// 分页的点击
const handleSizeChange = (pageSize) => {
  emits("update:page", { ...props.page, pageSize })
}
const paginationCurrentChange = (currentPage) => {
  emits("update:page", { ...props.page, currentPage })
}
</script>

<style lang="less" scoped>
.table {
  .footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 15px;
    margin-right: 20px;
    .pagination {
      flex: 1;
    }
  }
}
// 解决滚动条不显示
/deep/ .el-table--scrollable-x .el-table__body-wrapper {
  overflow: auto;
}
//Tabled单元格对齐
/deep/ .gutter {
  width: 22px !important;
  display: inline-block !important;
}
</style>
