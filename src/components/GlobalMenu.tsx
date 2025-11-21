import { TStrapiMenu, TStrapiRes } from '@/types/strapi.type'
import { keyBy } from 'lodash'
import { RootMenus } from './RootMenus'
import { fetchMenus } from '@/requests/getMenus'

function linkMenus(menus: TStrapiMenu[]) {
  const menuMap = keyBy(menus, 'documentId')
  return menus.map((menu) => {
    if (menu.children) {
      menu.children = menu.children.map((child) => menuMap[child.documentId])
    }
    return menu
  })
}

export default async function GlobalMenu() {
  const jsonData = await fetchMenus()
  const formatted = linkMenus(jsonData.data)

  return (
    <>
      <div className='h-8'></div>
      <RootMenus menus={formatted} />
      <div className='h-8'></div>
    </>
  )
}
