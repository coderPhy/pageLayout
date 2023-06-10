export const contentTableConfig = {
  propList: [
    { prop: "userName", label: "用户名", minWidth: "40" },
    { prop: "userPhone", label: "电话", minWidth: "60" },
    { prop: "roleId", label: "角色", minWidth: "30" },
    { prop: "userAccount", label: "账号", minWidth: "30" },
    { prop: "gmtCreateTime", label: "添加时间", minWidth: "50" },
    { prop: "userRemark", label: "备注", minWidth: "70" },
    { prop: "action", label: "操作", minWidth: "50", slotName: "handle" }
  ],
  showFooter: true,
  showIndexColumn: true,
  tableStyle: {}
}
