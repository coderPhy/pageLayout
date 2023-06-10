<template>
  <div class="page-header">
    <div class="user-info-wrapper">
      <el-dropdown @command="handleMenuClick">
        <div class="pointer">
          <span>{{ userInfo.userName }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="dialogVisible" title="修改密码" width="500px">
      <el-form ref="formRef" :model="formData" @close="dialogCancelClick">
        <el-form-item label="新密码" prop="userPassword">
          <el-input
            v-model.trim="formData.userPassword"
            clearable
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancelClick">取消</el-button>
          <el-button type="primary" @click="dialogConfirmClick">
            修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useStore } from "vuex"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"

import { editUserPassword } from "@/service/user"

const store = useStore()
const router = useRouter()

const formRef = ref()
const formData = ref({
  userPassword: ""
})
const dialogVisible = ref(false)
const userInfo = computed(() => {
  return store.state.user.userInfo || {}
})

const handleLogout = function () {
  store.dispatch("logout").then(() => {
    router.replace("/login")
  })
}

const handleMenuClick = (command) => {
  switch (command) {
    case "logout": {
      handleLogout()
      break
    }
    case "editPassword": {
      dialogVisible.value = true
      break
    }
  }
}

function dialogCancelClick() {
  dialogVisible.value = false
  formRef.value.resetFields()
}

function dialogConfirmClick() {
  editUserPassword(formData.value.userPassword).then((res) => {
    const state = res.code === 200 && res.success
    ElMessage({
      type: state ? "success" : "warning",
      message: `修改密码${state ? "成功!" : "失败!"}`
    })
    if (state) {
      dialogVisible.value = false
      formRef.value.resetFields()
    }
  })
}
</script>

<style lang="less" scoped>
.page-header {
  position: relative;
  width: 100%;
  height: 100%;
}

.user-info-wrapper {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
