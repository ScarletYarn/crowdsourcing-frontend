import {
  ElButton,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElFooter,
  ElMenu,
  ElSubmenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
// import {Form, FormItem, Input} from 'element-ui'

export default app => {
  locale.use(lang)
  app.use(ElButton)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElFooter)
  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItemGroup)
  app.use(ElMenuItem)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElMessage)
}
