'use client'

import { TStrapiMenu } from '@/types/strapi.type'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'

export const Breadcrumbs: FC<{ menus: TStrapiMenu[] }> = ({ menus }) => {
  const pathName = usePathname()
  const pathList = pathName?.split('/').filter((i) => i)
  const [pathMap, setPathMap] = useState<Map<string, string>>(new Map())
  return (
    <div className='opacity-50'>
      <span>Home</span>/
      <span>Category</span>/
      <span>Product</span>
    </div>
  )
}
