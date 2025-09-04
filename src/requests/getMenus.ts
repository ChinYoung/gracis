import { fetchStrapi } from '@/fns/fetchStrapi'
import { TStrapiMenu, TStrapiRes } from '@/types/strapi.type'
import { stringify } from 'qs'
import { cache } from 'react'

export const fetchMenus = cache(async () => {
  const queryString = stringify({
    populate: ['children', 'parent'],
  })

  const res = await fetchStrapi(`menus?${queryString}`, {
    next: { revalidate: 3600 },
  })
  const jsonData = await res.json<TStrapiRes<TStrapiMenu[]>>()
  return jsonData
})
