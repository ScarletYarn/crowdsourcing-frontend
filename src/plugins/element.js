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
  ElMenuItem
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

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
}
