<template>
  <div class="userList" v-if="permissions.permissionUserList">
    <page-layout
      ref="pageLayoutRef"
      :searchFormConfig="handleSearchFormConfig"
      :contentTableConfig="contentTableConfig"
      :getDataListFn="getUserList"
    >
      <template #button>
        <el-button
          plain
          type="primary"
          icon="DocumentAdd"
          v-if="permissions.permissionUserAdd"
          @click="() => openUserDialog('new')"
          >新增</el-button
        >
      </template>
      <template #roleId="scope">
        {{ roleList.find((item) => item.roleId === scope.row.roleId).roleName }}
      </template>
      <template #gmtCreateTime="scope">
        {{ datetimeFormatStyleTwo(scope.row.gmtCreateTime) }}
      </template>
      <template #action="scope">
        <el-button
          plain
          icon="Edit"
          type="info"
          v-if="permissions.permissionUserEdit"
          @click="() => openUserDialog('edit', scope.row)"
          >修改</el-button
        >
      </template>
    </page-layout>
    <user-dialog
      v-if="userDialogVisible"
      ref="userDialogRef"
      :visible="userDialogVisible"
      :dialogType="dialogType"
      :roleList="roleList"
      @dialogCancel="userDialogCancel"
    ></user-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { useStore } from "vuex"

import pageLayout from "@/components/page-layout"
import userDialog from "./cpns/userDialog.vue"

import { searchFormConfig } from "./config/search.config"
import { contentTableConfig } from "./config/content.config"

import { newUser, deleteUser, editUser, getUserList } from "@/service/user"
import { datetimeFormatStyleTwo } from "@/utils/date-format"
import { getRoleList } from "@/service/permission"

const store = useStore()
const pageLayoutRef = ref()
const userDialogRef = ref()
const userDialogVisible = ref(false)
const roleList = ref([])
const dialogType = ref("new")
const handleSearchFormConfig = ref(searchFormConfig)
const permissions = computed(() => store.getters["user/getUserPermissions"])

function getRoleListRequest() {
  getRoleList().then((res) => {
    roleList.value = res.data.data
  })
}

if (permissions.value.permissionList) {
  getRoleListRequest()
  // 给下拉框的options赋值
  handleSearchFormConfig.value.formItems.find(
    (item) => item.field === "roleId"
  ).options = computed(() =>
    roleList.value.map((item) => ({
      label: item?.roleName,
      value: item?.roleId
    }))
  )
} else {
  handleSearchFormConfig.value.formItems.pop()
  contentTableConfig.propList.splice(
    contentTableConfig.propList.findIndex((item) => item.prop === "roleId"),
    1
  )
}

// 打开新增/修改司机对话框
function openUserDialog(type, value) {
  dialogType.value = type
  userDialogVisible.value = true
  if (value)
    nextTick(() =>
      _.assign(userDialogRef.value.editUserData, {
        userId: value.userId,
        roleId: value.roleId,
        userRemark: value.userRemark,
        userAccount: value.userAccount
      })
    )
}
// 关闭新增/修改司机对话框
function userDialogCancel(needUpdate) {
  userDialogVisible.value = false
  if (needUpdate) pageLayoutRef.value.getTableData()
}
</script>

<style lang="less" scoped>
.userList {
  height: 100%;
}
</style>
