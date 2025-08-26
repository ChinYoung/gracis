export type TStrapiRes<T> = {
  data: T
  meta: {
    pagination: {
      page: number
      pageSize: number
      total: number
      pageCount: number
    }
  }
}

export type TStrapiItem<T> = T & {
  id: number
  locale: string
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type TStrapiTag = TStrapiItem<{
  name: string
  rid: string
}>

export type TStrapiMenu = TStrapiItem<{
  name: string
  path: string
  protected: boolean
  children: TStrapiMenu[]
  parent: TStrapiMenu | null
}>
