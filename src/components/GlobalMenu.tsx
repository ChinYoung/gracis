import { fetchStrapi } from '@/fns/fetchStrapi'
import { TStrapiMenu, TStrapiRes } from '@/types/strapi.type'
import { keyBy } from 'lodash'
import Link from 'next/link'
import qs from 'qs'
import { FC } from 'react'

const MenuItem: FC<{ menu: TStrapiMenu; prefix: string }> = ({
  menu,
  prefix,
}) => {
  const thisPath =
    menu.path === '/' ? '/' : `${prefix ? prefix : '/'}${menu.path}/`
  return (
    <div className='px-2 py-1 hover:scale-110 w-full h-fit rounded-lg cursor-pointer'>
      <Link href={thisPath} className='whitespace-nowrap'>
        {menu.name}
      </Link>
    </div>
  )
}

const RootMenu: FC<{ menu: TStrapiMenu }> = ({ menu }) => {
  return (
    <div key={menu.documentId} className='relative w-full group'>
      {/* root */}
      <MenuItem menu={menu} prefix='/' />
      {/* sub paths */}
      {menu.children && menu.children.length > 0 && (
        <div className='absolute left-0 top-[120%] bg-white'>
          <div className='shadow-2xl px-4 rounded-lg hidden opacity-0 group-hover:block group-hover:opacity-100 transition-discrete transition-all duration-800'>
            {menu.children.map((child) => (
              <div
                key={child.documentId}
                className='border-b border-gray-300 p-1 last:border-none'
              >
                {renderChildMenu(child, `/${menu.path}/`)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function renderChildMenu(menu: TStrapiMenu, prefix: string) {
  return (
    <div key={menu.documentId} className='flex gap-2'>
      {/* root */}
      <MenuItem menu={menu} prefix={prefix} />
      {/* sub paths */}
      <div>
        {menu.children &&
          menu.children.length > 0 &&
          menu.children.map((child) => (
            <div key={child.documentId}>
              {renderChildMenu(child, `${prefix ? prefix : '/'}${menu.path}/`)}
            </div>
          ))}
      </div>
    </div>
  )
}

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
  const queryString = qs.stringify({
    populate: ['children', 'parent'],
  })

  const res = await fetchStrapi(`menus?${queryString}`)
  const jsonData = await res.json<TStrapiRes<TStrapiMenu[]>>()
  const formatted = linkMenus(jsonData.data)
  console.log('🚀 ~ RootMenu ~ formatted:', formatted)

  return (
    <div className='flex gap-2 w-fit py-8'>
      {formatted
        .filter((i) => !i.parent)
        .sort((a, b) => b.priority - a.priority)
        .map((menu) => (
          <RootMenu key={menu.documentId} menu={menu} />
        ))}
    </div>
  )
}
