<template>
  <div class="userDialog">
    <el-dialog
      v-model="innerVisible"
      :title="dialogTypeToText[dialogType] + '用户'"
      width="35%"
      destroy-on-close
      append-to-body
      @close="dialogCancelClick"
    >
      <div class="formControl">
        <el-form
          v-if="dialogType === 'new'"
          ref="formRef"
          :model="newUserData"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="姓名" prop="userName">
            <el-input v-model.trim="newUserData.userName" clearable />
          </el-form-item>
          <el-form-item label="账号" prop="userAccount">
            <el-input v-model.trim="newUserData.userAccount" clearable />
          </el-form-item>
          <el-form-item label="电话" prop="userPhone">
            <el-input v-model.trim="newUserData.userPhone" clearable />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="newUserData.roleId" size="large" clearable>
              <el-option
                v-for="value in roleList"
                :key="value.roleId"
                :label="value.roleName"
                :value="value.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="userRemark">
            <el-input v-model.trim="newUserData.userRemark" type="textarea" />
          </el-form-item>
        </el-form>
        <el-form v-else ref="formRef" :model="editUserData" label-width="50px">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="editUserData.roleId" size="large" clearable>
              <el-option
                v-for="value in roleList"
                :key="value.roleId"
                :label="value.roleName"
                :value="value.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账号" prop="userAccount">
            <el-input v-model.trim="editUserData.userAccount" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="userRemark">
            <el-input v-model.trim="editUserData.userRemark" clearable />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <div v-if="dialogType === 'edit'" style="float: left">
            <el-button @click="openResetPasswordDialog">重置密码</el-button>
          </div>
          <div>
            <el-button @click="dialogCancelClick">取消</el-button>
            <el-button type="primary" @click="dialogConfirmClick">{{
              dialogTypeToText[dialogType]
            }}</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="resetPasswordVisible"
      title="重置密码"
      width="500px"
      destroy-on-close
      append-to-body
      @close="resetUserPasswordDialogCancelClick"
    >
      <div>确定要重置密码吗？</div>
      <template #footer>
        <div>
          <el-button @click="resetUserPasswordDialogCancelClick"
            >取消</el-button
          >
          <el-button type="primary" @click="resetUserPasswordRequest"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  defineProps,
  defineEmits,
  getCurrentInstance
} from "vue"
import { ElMessage } from "element-plus"
import { newUser, editUser, resetUserPassword } from "@/service/user"

const { RULES } = getCurrentInstance().appContext.config.globalProperties
const props = defineProps({
  visible: {
    type: Boolean,
    required: false
  },
  dialogType: {
    type: String,
    default: "new"
  },
  roleList: {
    type: Array,
    default: () => [
      {
        roleId: "",
        roleName: ""
      }
    ]
  }
})
const emits = defineEmits(["dialogCancel"])

const formRef = ref()
const innerVisible = computed(() => props.visible)
const resetPasswordVisible = ref(false)
const newUserData = ref({
  roleId: "",
  userName: "",
  userAccount: "",
  userPhone: "",
  userRemark: ""
})
const editUserData = ref({
  userId: "",
  roleId: "",
  userAccount: "",
  userRemark: ""
})
const dialogTypeToText = {
  new: "新增",
  edit: "修改"
}
const rules = reactive({
  userName: [
    {
      required: true,
      message: "姓名是必填的",
      trigger: "blur"
    }
  ],
  userPhone: [
    {
      required: true,
      message: "电话是必填的",
      trigger: "blur"
    },
    {
      pattern: RULES.PHONE,
      message: "电话必须是11个数字~",
      trigger: "blur"
    }
  ],
  roleId: [
    {
      required: true,
      message: "用户角色是必填的",
      trigger: "blur"
    }
  ],
  userRemark: []
})

// 新增/修改请求
async function dialogConfirmClick() {
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (!valid) return
    const requestFun = props.dialogType === "new" ? newUser : editUser
    const operationText = dialogTypeToText[props.dialogType]
    const requestdata =
      props.dialogType === "new" ? newUserData.value : editUserData.value
    requestFun(requestdata)
      .then((res) => {
        const state = res.code === 200 && res.success
        ElMessage({
          type: state ? "success" : "error",
          message: operationText + (state ? `用户成功` : `用户失败`)
        })
        emits("dialogCancel", state)
      })
      .catch((err) =>
        ElMessage({
          type: "error",
          message: operationText + `用户失败`
        })
      )
  })
}

// 对话框关闭
function dialogCancelClick() {
  formRef.value.resetFields()
  emits("dialogCancel")
}

// 打开确认重置密码对话框
function openResetPasswordDialog() {
  resetPasswordVisible.value = true
}
// 对话框关闭
function resetUserPasswordDialogCancelClick() {
  resetPasswordVisible.value = false
}
// 重置密码
function resetUserPasswordRequest() {
  resetUserPassword(editUserData.value.userId)
    .then((res) => {
      const state = res.code === 200 && res.success
      ElMessage({
        type: state ? "success" : "error",
        message: `重置密码${state ? `成功！` : `失败！`}`
      })
      if (state) {
        resetPasswordVisible.value = false
      }
    })
    .catch((err) =>
      ElMessage({
        type: "error",
        message: `重置密码失败！`
      })
    )
}

defineExpose({
  editUserData
})
</script>

<style lang="less" scoped>
.userDialog {
  .dialog-footer {
  }
}
</style>
