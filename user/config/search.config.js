export const searchFormConfig = {
  formItems: [
    {
      field: 'userName',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      default: ""
    },
    {
      field: 'userPhone',
      type: 'input',
      label: '电话',
      placeholder: '请输入电话号码',
      default: ""
    },
    {
      field: "roleId",
      type: "select",
      label: "角色",
      options: [],
      default: ""
    }
  ],
  labelWidth: "60px",
  itemStyle: {
  },
  colLayout: { span: 8 }
}