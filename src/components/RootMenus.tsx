'use client'

import { TStrapiMenu } from '@/types/strapi.type'
import { ConfigProvider, theme } from 'antd'
import Link from 'next/link'
import { FC, UIEvent, useCallback, useEffect, useRef, useState } from 'react'

const MenuItem: FC<{ menu: TStrapiMenu; prefix: string }> = ({
  menu,
  prefix,
}) => {
  const thisPath =
    menu.path === '/' ? '/' : `${prefix ? prefix : '/'}${menu.path}/`
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className='px-2 py-1 hover:scale-110 w-full h-fit rounded-lg cursor-pointer'>
        <Link href={thisPath} className='whitespace-nowrap'>
          {menu.name}
        </Link>
      </div>
    </ConfigProvider>
  )
}

const RootMenu: FC<{ menu: TStrapiMenu }> = ({ menu }) => {
  return (

    <div key={menu.documentId} className='relative w-fit group'>
      {/* root */}
      <MenuItem menu={menu} prefix='/' />
      {/* sub paths */}
      {menu.children && menu.children.length > 0 && (
        <div className='absolute left-0 top-[100%]  hidden opacity-0 group-hover:block group-hover:opacity-100 transition-discrete transition-all duration-800'>
          <div className='mt-2 px-10 py-4 rounded-lg shadow-2xl'>
            {menu.children.map((child) => (
              <div
                key={child.documentId}
                className='border-b border-gray-300 last:border-none py-4'
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
    <div key={menu.documentId} className='flex w-full'>
      {/* root */}
      <div className='w-1/2 pr-8'>
        <MenuItem menu={menu} prefix={prefix} />
      </div>
      {/* sub paths */}
      <div className='w-1/2'>
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

export const RootMenus: FC<{ menus: TStrapiMenu[] }> = ({ menus }) => {
  const [isSticky, setIsSticky] = useState(false)
  console.log('🚀 ~ RootMenu ~ isSticky:', isSticky)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function scrollHandler() {
      if (!divRef.current) return
      const rect = divRef.current?.getBoundingClientRect()
      console.log('🚀 ~ RootMenu ~ rect:', rect)
      setIsSticky(rect.top <= 0)
    }
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])
  return (
    <div
      className='w-full sticky top-0 pt-2 pb-1 flex gap-2 justify-start  px-10 bg-[var(--background)]'
      ref={divRef}
    >
      {isSticky ? (
        <div className='absolute top-0 left-0 right-0 bottom-0 shadow-2xl'></div>
      ) : null}
      {menus
        .filter((i) => !i.parent)
        .sort((a, b) => b.priority - a.priority)
        .map((menu) => (
          <RootMenu key={menu.documentId} menu={menu} />
        ))}
    </div>
  )
}
